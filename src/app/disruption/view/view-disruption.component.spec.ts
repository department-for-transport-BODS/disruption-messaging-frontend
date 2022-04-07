import { ViewDisruptionComponent } from './view-disruption.component';
import { ComponentFixture, async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { EditDisruptionService } from '../edit/edit-disruption.service';
import { ViewDisruptionService } from './view-disruption.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ViewDisruptionViewModel } from './view-disruption.viewmodel';
import { hot, cold, getTestScheduler, initTestScheduler } from 'jasmine-marbles';
import { CommonModule } from '@angular/common';
import { DeleteDisruptionModule } from '../delete/delete-disruption.module';
import { ViewDisruptionOverviewComponent } from './overview/overview.component';
import { ViewDisruptionImpactsComponent } from './impacts/impacts.component';
import { ViewDisruptionMessagingComponent } from './messaging/messaging.component';
import { ApproveDisruptionComponent } from './approve/approve-disruption.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { BadgeComponent } from './overview/badge/badge.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


const urlSegments: UrlSegment[] = [
	new UrlSegment('disruption', {}),
	new UrlSegment('view', {}),
	new UrlSegment('124', {})
];

class MockActivatedRoute {
	get snapshot() {
		return {
			paramMap: {
				get: () => 124
			}
		};
	}

	get url() {
		return cold('a|', {a: urlSegments});
	}
}

describe('ViewDisruptionComponent', () => {
	let component: ViewDisruptionComponent;
	let fixture: ComponentFixture<ViewDisruptionComponent>;
	let editDisruptionService: EditDisruptionService;
	let disruptionViewService: ViewDisruptionService;

	const id = 124;
	initTestScheduler();
	const mockRouter = {
		url: jasmine.createSpy()
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				ViewDisruptionComponent,
				ViewDisruptionOverviewComponent,
				ViewDisruptionImpactsComponent,
				ViewDisruptionMessagingComponent,
				ApproveDisruptionComponent,
				BadgeComponent
			],
			imports: [
				CommonModule,
				NgSelectModule,
				FormsModule,
				DeleteDisruptionModule,
				SharedModule,
				RouterTestingModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				HttpClientTestingModule
			],
			providers: [
				EditDisruptionService,
				NgxSmartModalService,
				ViewDisruptionService,
				{ provide: ActivatedRoute, useValue: new MockActivatedRoute() },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		disruptionViewService = TestBed.get(ViewDisruptionService);
		editDisruptionService = TestBed.get(EditDisruptionService);
		fixture = TestBed.createComponent(ViewDisruptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});


	it('should parse id from route', () => {
		component.ngOnInit();
		expect(component.id).toBe(id);
	});

	it('should set disruption from id', () => {
		spyOn(disruptionViewService, 'setCurrentDisruption');
		component.ngOnInit();
		getTestScheduler().flush();
		expect(disruptionViewService.setCurrentDisruption).toHaveBeenCalledWith(id);
	});

	it('should update disruption with data from current', () => {
		const viewModel: ViewDisruptionViewModel = {
			id: '124',
			encodedId: 'ensd4534',
			isTemplate: false,
			title: 'fake',
			duration: ''
		};
		const $obs = cold('a|', { a: viewModel });
		spyOnProperty(disruptionViewService, 'currentDisruption$').and.returnValue($obs);

		// set errors that the new disruptions will clear.
		component.errors = { some: 'object' };

		component.ngOnInit();

		$obs.subscribe(s => {
			expect(component.disruption).toBe(s);
			expect(component.errors).toBe(null);
		});
	});
});
