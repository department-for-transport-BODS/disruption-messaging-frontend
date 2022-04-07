import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { INotificationTypeEnum, IUserType } from 'src/generated/graphql';
import { NotificationSettingsService } from './notification-settings.service';
import { NotificationSettingsForm } from './notification-settings.form';

@Component({
	selector: 'dm-notification-settings',
	templateUrl: './notification-settings.component.html',
	styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit, OnDestroy {
	redirectUrl: string;
	user: IUserType = null;
	settingsForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService,
		private notificationSettingsService: NotificationSettingsService
	) {}

	ngOnInit() {
		this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
		this.settingsForm = this.formBuilder.group(new NotificationSettingsForm(this.formBuilder));
		this.notificationSettingsService.notificationSettings$().subscribe(viewModels => {
			if (!viewModels) { return; }
			this.settings.clear();
			viewModels.map(vm =>
				this.settings.push(
					this.formBuilder.group({
						email: [vm.email],
						inApp: [vm.inApp],
						setting: [vm.notificationType]
					})
				)
			);
		});
	}

	get settings() {
		return this.settingsForm.get('settings') as FormArray;
	}

	displayName(idx: number) {
		return this.settings.at(idx).get('setting').value;
	}

	ngOnDestroy(): void {}

	onSubmit() {
		this.notificationSettingsService.update(this.settingsForm);
	}

	private modalClose() {
		this.modalService.getModal('notificationsModal').close();
	}

	onClose() {
		this.modalClose();
		this.router.navigate([this.redirectUrl]);
		this.notificationSettingsService.reset();
	}

	description(enumValue: INotificationTypeEnum) {
		switch (enumValue) {
			case INotificationTypeEnum.DisruptionSubmitted:
				return 'Notifies you when a disruption is submitted for approval';
			case INotificationTypeEnum.DisruptionApproved:
				return 'Notifies you when your disruptions is approved';
			case INotificationTypeEnum.DisruptionRejected:
				return 'Notifies you when your disruption is rejected';
			case INotificationTypeEnum.DisruptionDuplicate:
				return 'Notifies you when a duplicate disruption is detected';
			case INotificationTypeEnum.DisruptionPublishingFailed:
				return 'Notifies you when a social message fails to post to Twitter or Facebook';
			case INotificationTypeEnum.DisruptionOpenEnded:
				return 'Notifies you when a disruption without end dates requires checking';
			case INotificationTypeEnum.DisruptionMissingReferenceByUser:
				return 'Notifies you when a disruption you have created is using references that are no longer valid';
			case INotificationTypeEnum.DisruptionOpenUnedited:
				return 'Notifies you when a disruption is open for a long time';
			case INotificationTypeEnum.DisruptionMissingReferenceByOrganisation:
				return 'Notifies you when any disruption in your organisation is using references that are no longer valid';
		}
	}
}
