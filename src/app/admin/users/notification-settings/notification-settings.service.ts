import { Injectable } from '@angular/core';
import { QueryService } from 'src/app/shared/services/query.service';
import { Observable } from 'rxjs';
import { INotificationSettingsViewModel } from './notification-settings.viewmodel';
import {
	IAllNotificationSettingsGQL,
	INotificationSettingsType,
	IUpdateNotificationSettingsGQL
} from 'src/generated/graphql';
import { INotificationSettingsViewModelMapper } from './notification-settings.viewmodel.mapper';
import { filter, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class NotificationSettingsService extends QueryService {
	constructor(
		private notificationSettingsGQL: IAllNotificationSettingsGQL,
		private updateNotificationsGQL: IUpdateNotificationSettingsGQL,
		private mapper: INotificationSettingsViewModelMapper
	) {
		super();
	}

	notificationSettings$(): Observable<INotificationSettingsViewModel[]> {
		return this.notificationSettingsGQL
			.watch()
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(res =>
					res.data.notificationSettings.map(
						setting =>
							this.mapper.toViewModel(setting as INotificationSettingsType)
					)
				)
			);
	}

	update(settings: FormGroup) {
		const input = this.mapper.toNotificationSettingsInput(settings);
		this.updateNotificationsGQL
			.mutate({ params: input }, { refetchQueries: [{ query: this.notificationSettingsGQL.document }] })
			.subscribe(result => this.responseHandler(result));
	}

	reset() {
		this.resetSubjects();
	}
}
