import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserStoreService } from 'src/app/user/user.store.service';
import { IUserType } from 'src/generated/graphql';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Router } from '@angular/router';
import { UserNotificationViewModel } from 'src/app/user/user.notification.view.model';
import { UserNotificationsMapper } from 'src/app/user/user.notifications.mapper';
import { NotificationService } from 'src/app/menu/user-menu/notification/notification.service';
import { Subscription } from 'rxjs';
import { IDisruptionNotificationStatus } from 'src/generated/enum-overrides';
import { UsersService } from '../../admin/users/users.service';
import { UserMapper } from '../../admin/users/user.mapper';
import { PopoverService } from '../../shared/components/popover/popover.service';

@Component({
	selector: 'dm-user-menu',
	templateUrl: './user-menu.component.html',
	styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy {
	userSubscription: Subscription;
	notificationSubscription: Subscription;

	user: IUserType = null;
	notifications: UserNotificationViewModel[] = [];
	settingsEnabled = false;

	constructor(
		private userStore: UserStoreService,
		private authenticationService: AuthenticationService,
		private routerService: Router,
		private notificationsMapper: UserNotificationsMapper,
		private notificationService: NotificationService,
		private usersService: UsersService,
		private popoverService: PopoverService,
		private mapperService: UserMapper
	) {}

	ngOnInit(): void {
		this.userSubscription = this.userStore.user$.subscribe(user => {
			this.user = user;
			if (user) {
				this.notifications = this.notificationsMapper.toViewModel(user.disruptionNotifications);
				this.settingsEnabled = this.userStore.isAuthorisedForSettings();
			}
		});

		this.notificationSubscription = this.notificationService.notificationRead$.subscribe(notification => {
			if (!this.notifications) {
				return;
			}

			this.notifications.map(n => {
				if (n.id === notification) {
					n.status = IDisruptionNotificationStatus.A_0;
				}
			});
		});
	}

	ngOnDestroy(): void {
		if (this.userSubscription) {
			this.userSubscription.unsubscribe();
		}
		if (this.notificationSubscription) {
			this.notificationSubscription.unsubscribe();
		}
	}

	get unreadCount() {
		return this.notifications
			? this.notifications.filter(f => f.status === IDisruptionNotificationStatus.A_1).length
			: 0;
	}

	logout(event: Event) {
		event.preventDefault();
		this.popoverService.close('user-profile');
		this.authenticationService.logout();
	}

	changePassword(event: Event) {
		event.preventDefault();
		this.routerService.navigate(['/change-password'], { queryParams: { redirect: this.routerService.url } });
	}

	notificationSettings(event: Event) {
		event.preventDefault();
		this.routerService.navigate(['/notification-settings'], { queryParams: { redirect: this.routerService.url } });
	}

	showUserForm(event: Event) {
		event.preventDefault();
		this.usersService.viewUserProfile(this.mapperService.getModel(this.user));
	}

	settings(event: Event) {
		event.preventDefault();
		this.popoverService.close('user-profile');
		this.routerService.navigate(['/settings']);
	}

	markAsRead(id: string) {
		this.notificationService.markAsRead(id);
	}
}
