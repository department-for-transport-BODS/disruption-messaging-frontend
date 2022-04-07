import { INotificationSettingsType, INotificationSettingsInputType } from 'src/generated/graphql';
import { INotificationSettingsViewModel } from './notification-settings.viewmodel';
import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class INotificationSettingsViewModelMapper {
	public toNotificationSettingsInput(form: FormGroup): INotificationSettingsInputType[] {
		const formArray = form.controls.settings as FormArray;
		const controls = formArray.controls.map(m => m.value);
		return controls.map(item => {
			return {
				email: item.email,
				inApp: item.inApp,
				notificationType: item.setting
			};
		});
	}

	public toViewModel(node: INotificationSettingsType): INotificationSettingsViewModel {
		return {
			email: node.email ? node.email : false,
			inApp: node.inApp ? node.inApp : false,
			notificationType: node.notificationType
		};
	}
}
