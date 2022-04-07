import { NotificationSettingsService } from './notification-settings.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { INotificationSettingsViewModelMapper } from './notification-settings.viewmodel.mapper';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { INotificationSettingsViewModel } from './notification-settings.viewmodel';
import {
	INotificationSettingsType,
	INotificationTypeEnum,
	INotificationSettingsInputType
} from 'src/generated/graphql';

describe('NotificationSettingsService', () => {
	let service: NotificationSettingsService;
	let controller: ApolloTestingController;
	let viewModelMapper: INotificationSettingsViewModelMapper;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, HttpClientModule, RouterTestingModule],
			declarations: [],
			providers: [NotificationSettingsService]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(NotificationSettingsService);
		viewModelMapper = TestBed.get(INotificationSettingsViewModelMapper);
	});

	const viewModel: INotificationSettingsViewModel = {
		email: true,
		inApp: false,
		notificationType: INotificationTypeEnum.DisruptionSubmitted
	};

	const setting: INotificationSettingsType = {
		email: true,
		inApp: false,
		notificationType: INotificationTypeEnum.DisruptionSubmitted,
		id: '1'
	} as INotificationSettingsType;

	it('should get all notification settings', done => {
		spyOn(viewModelMapper, 'toViewModel').and.returnValue(viewModel);

		service.notificationSettings$().subscribe(acc => {
			expect(acc[0]).toBe(viewModel);
			expect(acc.length).toBe(1);
			done();
		});

		controller.expectOne('allNotificationSettings').flush({
			data: { notificationSettings: [setting] }
		});
		controller.verify();
	});

	it('should update settings', fakeAsync(() => {
		const input: INotificationSettingsInputType[] = [
			{
				email: true,
				inApp: false,
				notificationType: INotificationTypeEnum.DisruptionOpenEnded
			}
		];
		const form: any = {};

		spyOn(viewModelMapper, 'toNotificationSettingsInput').and.returnValue(input);

		service.update(form);

		const mutation = controller.expectOne('updateNotificationSettings');
		expect(mutation.operation.variables.params).toBe(input);

		mutation.flush({
			data: {
				notificationSettings: {
					success: true,
					errors: null,
					data: {
						notificationType: INotificationTypeEnum.DisruptionApproved,
						id: 1
					}
				}
			}
		});

		controller.expectOne('allNotificationSettings').flush({
			data: { notificationSettings: [setting] }
		});

		flush();
		controller.verify();
	}));
});
