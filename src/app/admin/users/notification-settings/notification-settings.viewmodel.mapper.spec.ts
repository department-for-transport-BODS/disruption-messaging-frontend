import { INotificationSettingsViewModelMapper } from './notification-settings.viewmodel.mapper';
import { FormBuilder, FormArray } from '@angular/forms';
import { NotificationSettingsForm } from './notification-settings.form';
import { INotificationTypeEnum, INotificationSettingsInputType, INotificationSettingsType } from 'src/generated/graphql';

describe('NotificationSettingsViewModelMapper', () => {
	const mapper = new INotificationSettingsViewModelMapper();
	const formBuilder = new FormBuilder();

	it('should map view model to graphQL model', () => {
		const settingsForm = formBuilder.group(new NotificationSettingsForm(formBuilder));
		const array = settingsForm.get('settings') as FormArray;
		array.push(
			formBuilder.group({
				email: [true],
				inApp: [false],
				setting: [INotificationTypeEnum.DisruptionApproved]
			})
		);
		array.push(
			formBuilder.group({
				email: [true],
				inApp: [true],
				setting: [INotificationTypeEnum.DisruptionRejected]
			})
		);
		array.push(
			formBuilder.group({
				email: [false],
				inApp: [false],
				setting: [INotificationTypeEnum.DisruptionSubmitted]
			})
		);
		const result = mapper.toNotificationSettingsInput(settingsForm);
		expect(result.length).toBe(3);
		expect(result[0].email).toBe(true);
		expect(result[0].inApp).toBe(false);
		expect(result[0].notificationType).toBe(INotificationTypeEnum.DisruptionApproved);
		expect(result[1].email).toBe(true);
		expect(result[1].inApp).toBe(true);
		expect(result[1].notificationType).toBe(INotificationTypeEnum.DisruptionRejected);
		expect(result[2].email).toBe(false);
		expect(result[2].inApp).toBe(false);
		expect(result[2].notificationType).toBe(INotificationTypeEnum.DisruptionSubmitted);
	});

	it('should map graphQL model to view model', () => {
		const node: INotificationSettingsType = {
			email: false,
			inApp: true,
			notificationType: INotificationTypeEnum.DisruptionOpenEnded
		} as INotificationSettingsType;

		const result = mapper.toViewModel(node);

		expect(result.email).toBe(false);
		expect(result.inApp).toBe(true);
		expect(result.notificationType).toBe(INotificationTypeEnum.DisruptionOpenEnded);
	});
});
