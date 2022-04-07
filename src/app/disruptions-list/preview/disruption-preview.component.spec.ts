import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { DisruptionPreviewComponent } from './disruption-preview.component';
import { cold } from 'jasmine-marbles';
import { DisruptionsListService } from '../disruptions-list.service';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DeleteDisruptionModule } from 'src/app/disruption/delete/delete-disruption.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('disruptionPreviewComponent', () => {
	let component: DisruptionPreviewComponent;
	let fixture: ComponentFixture<DisruptionPreviewComponent>;
	let disruptionsService: DisruptionsListService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ApolloTestingModule,
				SharedModule,
				RouterModule,
				DeleteDisruptionModule,
				NgxSmartModalModule.forRoot(),
				NgxSpinnerModule],
			declarations: [DisruptionPreviewComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionPreviewComponent);
		component = fixture.componentInstance;
		disruptionsService = TestBed.get(DisruptionsListService);
		fixture.detectChanges();
	});

	it('should create without disruption', () => {
		expect(component.disruptionSet()).toBe(false);
	});

	it('should update disruption when subscription changes', () => {
		const viewModel = jasmine.createSpyObj('DisruptionPreviewViewModel', ['id']);
		const obs$ = cold('--a-|', { a: viewModel });

		spyOnProperty(disruptionsService, 'previewDisruption$').and.returnValue(obs$);

		component.ngOnInit();

		obs$.subscribe({
			complete: () => {
				expect(component.disruption).toBe(viewModel);
			}
		});
	});
});
