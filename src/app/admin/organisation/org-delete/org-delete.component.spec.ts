import { async, ComponentFixture, fakeAsync, TestBed, flush, tick } from '@angular/core/testing';
import { OrgDeleteComponent } from './org-delete.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrganisationService } from '../organisation.service';
import { AdminAreasService } from '../admin_areas.service';
import { cold } from 'jasmine-marbles';
import { OrganisationViewModel } from '../organisation.viewmodel';
import { MockModalService } from 'src/app/shared/services/mock-modal.service';

describe('OrgDeleteComponent', () => {
	let component: OrgDeleteComponent;
	let fixture: ComponentFixture<OrgDeleteComponent>;
	let service: OrganisationService;
	let orgDeleteSpy;
	let subscriptionSpy;
	const viewModel: OrganisationViewModel = {
		id: '1',
		name: 'organisation-1',
		url: 'http://foo.com',
		adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222, organisations: null }],
		adminAreasString: 'An area'
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				FormsModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule
			],
			declarations: [OrgDeleteComponent],
			providers: [
				FormBuilder,
				OrganisationService,
				AdminAreasService,
				{ provide: NgxSmartModalService, useClass: MockModalService }
			]
		}).compileComponents();
		service = TestBed.get(OrganisationService);
		orgDeleteSpy = spyOn(service, 'delete').and.returnValue(null);
		const obs = cold('a|', { a: viewModel });
		subscriptionSpy = spyOnProperty(service, 'deletedOrganisation$').and.returnValue(obs);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrgDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should subscribe for selected organisation for delete', fakeAsync(() => {
		component.ngOnInit();
		expect(subscriptionSpy).toHaveBeenCalled();
		subscriptionSpy().subscribe(() => expect(component.organisation).toBeTruthy());
	}));

	it('should delete organisation on confirm', fakeAsync(() => {
		expect(orgDeleteSpy).toHaveBeenCalledTimes(0);
		component.organisation = viewModel;
		const confirmDeleteBtn = fixture.nativeElement.querySelectorAll('dm-button');
		const button = confirmDeleteBtn[1].querySelector('button');
		button.click();
		flush();
		fixture.detectChanges();
		expect(orgDeleteSpy).toHaveBeenCalled();
	}));

	it('should not delete organisation on close', fakeAsync(() => {
		component.organisation = viewModel;
		const cancelDeleteBtn = fixture.nativeElement.querySelectorAll('dm-button');
		const button = cancelDeleteBtn[0].querySelector('button');
		button.click();
		flush();
		fixture.detectChanges();
		expect(orgDeleteSpy).toHaveBeenCalledTimes(0);
	}));
});
