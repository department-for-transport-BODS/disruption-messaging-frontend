import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NotificationSettingsComponent } from './notification-settings.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NotificationSettingsService } from './notification-settings.service';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { INotificationTypeEnum } from 'src/generated/graphql';
import { Router, ActivatedRoute } from '@angular/router';

describe('NotificationSettingsComponent', () => {
	let component: NotificationSettingsComponent;
	let fixture: ComponentFixture<NotificationSettingsComponent>;
	let service: NotificationSettingsService;
	let modalService: NgxSmartModalService;

	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
	const mockRouter = {
		navigate: jasmine.createSpy('navigate')
	};
	const mockActivatedRoute = {
		snapshot: { queryParamMap: { get: jasmine.createSpy() } }
	};
	mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue('/disruptions');

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationSettingsComponent],
			imports: [
				NgxSmartModalModule.forRoot(),
				ReactiveFormsModule,
				ApolloTestingModule,
				RouterTestingModule,
				SharedModule
			],
			providers: [
				FormBuilder,
				NotificationSettingsService,
				NgxSmartModalService,
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationSettingsComponent);
		component = fixture.componentInstance;
		service = TestBed.get(NotificationSettingsService);
		modalService = TestBed.get(NgxSmartModalService);
		fixture.detectChanges();
	});

	afterEach(() => {
		mockRouter.navigate.calls.reset();
	});

	it('should call service to update on submit', () => {
		spyOn(service, 'update');
		component.onSubmit();
		expect(service.update).toHaveBeenCalledWith(component.settingsForm);
	});

	it('should redirect to calling url on close', () => {
		component.ngOnInit();
		fixture.detectChanges();

		spyOn(modalService, 'getModal').and.returnValue(mockModal);
		spyOn(service, 'reset');

		component.onClose();

		expect(modalService.getModal).toHaveBeenCalledWith('notificationsModal');
		expect(mockModal.close).toHaveBeenCalled();
		expect(service.reset).toHaveBeenCalledTimes(1);
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/disruptions']);
	});

	it('should map the submitted enum to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionSubmitted);
		expect(result).toBe('Notifies you when a disruption is submitted for approval');
	});

	it('should map the enum approved to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionApproved);
		expect(result).toBe('Notifies you when your disruptions is approved');
	});

	it('should map the enum rejected to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionRejected);
		expect(result).toBe('Notifies you when your disruption is rejected');
	});

	it('should map the enum for duplicated to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionDuplicate);
		expect(result).toBe('Notifies you when a duplicate disruption is detected');
	});

	it('should map the enum for social media failed to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionPublishingFailed);
		expect(result).toBe('Notifies you when a social message fails to post to Twitter or Facebook');
	});

	it('should map the enum required checking to human readable sentence', () => {
		const result = component.description(INotificationTypeEnum.DisruptionOpenEnded);
		expect(result).toBe('Notifies you when a disruption without end dates requires checking');
	});
});
