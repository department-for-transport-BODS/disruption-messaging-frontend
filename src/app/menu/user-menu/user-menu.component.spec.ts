import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { UserMenuComponent } from './user-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStoreService } from 'src/app/user/user.store.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { UserNotificationsMapper } from 'src/app/user/user.notifications.mapper';
import { Router } from '@angular/router';
import {
	IUserType,
	IDisruptionNotificationNodeConnection,
	IDisruptionNode,
	IDisruptionNotificationDetailsNode
} from 'src/generated/graphql';
import { cold, getTestScheduler } from 'jasmine-marbles';
import * as moment from 'moment';
import { IDisruptionNotificationMessageType, IDisruptionNotificationStatus } from 'src/generated/enum-overrides';
import { UserNotificationViewModel } from 'src/app/user/user.notification.view.model';
import { NotificationService } from 'src/app/menu/user-menu/notification/notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationComponent } from './notification/notification.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { UserEditComponent } from '../../admin/users/user-edit/user-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

describe('UserMenuComponent', () => {
	let component: UserMenuComponent;
	let fixture: ComponentFixture<UserMenuComponent>;
	let userStore: UserStoreService;
	let authService: AuthenticationService;
	let notificationService: NotificationService;
	let notificationMapper: UserNotificationsMapper;

	const mockRouter = {
		get url() {
			return 'dashboard';
		},
		navigate: jasmine.createSpy('navigate')
	};

	const mockEvent: any = {
		preventDefault() {}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AngularSvgIconModule,
				RouterTestingModule,
				SharedModule,
				ApolloTestingModule,
				HttpClientTestingModule,
				NgxSmartModalModule.forRoot(),
				NgSelectModule,
				ReactiveFormsModule
			],
			declarations: [UserMenuComponent, NotificationComponent, UserEditComponent],
			providers: [
				AuthenticationService,
				UserStoreService,
				UserNotificationsMapper,
				NotificationService,
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();
	}));

	afterEach(() => {
		mockRouter.navigate.calls.reset();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		userStore = TestBed.get(UserStoreService);
		authService = TestBed.get(AuthenticationService);
		notificationService = TestBed.get(NotificationService);
		notificationMapper = TestBed.get(UserNotificationsMapper);
	});

	it('should navigate on change password', () => {
		spyOn(mockEvent, 'preventDefault');

		component.changePassword(mockEvent);

		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/change-password'], {
			queryParams: { redirect: 'dashboard' }
		});
	});

	it('should call logout', () => {
		spyOn(mockEvent, 'preventDefault');
		spyOn(authService, 'logout');

		component.logout(mockEvent);

		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(authService.logout).toHaveBeenCalled();
	});

	it('should call notification service', () => {
		spyOn(notificationService, 'markAsRead');

		component.markAsRead('fakeId');

		expect(notificationService.markAsRead).toHaveBeenCalledWith('fakeId');
	});

	it('should mark notification as read', fakeAsync(() => {
		component.notifications = [
			{
				id: 'fakeId',
				disruptionId: '1',
				message: 'message',
				sent: 'a long time ago',
				status: IDisruptionNotificationStatus.A_1,
				type: IDisruptionNotificationMessageType.A_0,
				duplicates: []
			}
		];

		const obs$ = cold('a', { a: 'fakeId' });
		spyOnProperty(notificationService, 'notificationRead$').and.returnValue(obs$);
		flush();
		notificationService.notificationRead$.subscribe(s => {
			expect(component.notifications[0].status).toEqual(IDisruptionNotificationStatus.A_1);
		});
	}));

	it('should get unread notification count as 0 when empty', () => {
		expect(component.unreadCount).toEqual(0);
	});

	it('should set user as value from subscribe',   () => {
		const nodeconnection: IDisruptionNotificationNodeConnection = {
			edges: [
				{
					node: {
						id: 'fakeId',
						details: {
							disruption: {
								id: 'RGlzcnVwdGlvbk5vZGU6ODY=',
								title: 'titles, titles, titles',
								created: null,
								createdBy: null,
								deleted: false,
								isTemplate: false,
								modified: null,
								reason: null,
								status: null,
								type: null,
								version: null,
								isOpenEnded: false
							} as IDisruptionNode,
							created: moment.now(),
							message: 'This notification is a test one.',
							type: 'A_1' as IDisruptionNotificationMessageType,
							id: 'fake',
							modified: null
						} as IDisruptionNotificationDetailsNode,
						sent: moment.now(),
						status: 'A_1' as IDisruptionNotificationStatus,
						user: null
					},
					cursor: ''
				}
			],
			pageInfo: {
				hasNextPage: null,
				hasPreviousPage: null
			},
			totalCount: 10
		};

		const user: IUserType = {
			id: '1',
			email: 'email@email.com',
			username: 'username',
			disruptionNotifications: nodeconnection
		};

		const viewModel: UserNotificationViewModel[] = [
			{
				disruptionId: '1',
				id: '1',
				message: 'm',
				sent: '1',
				status: IDisruptionNotificationStatus.A_1,
				type: IDisruptionNotificationMessageType.A_1,
				duplicates: []
			}
		];

		const user$ = cold('a', { a: user });
		const notificationRead$ = cold('a', { a: ''});
		spyOnProperty(userStore, 'user$').and.returnValue(user$);
		spyOnProperty(notificationService, 'notificationRead$').and.returnValue(notificationRead$);

		spyOn(userStore, 'isAuthorisedForSettings').and.returnValue(true);
		spyOn(notificationMapper, 'toViewModel').and.returnValue(viewModel);

		component.settingsEnabled = true;
		fixture.detectChanges();
		component.ngOnInit();

		getTestScheduler().flush();
		expect(notificationMapper.toViewModel).toHaveBeenCalledWith(user.disruptionNotifications);
		expect(component.notifications).toBe(viewModel);
		expect(component.unreadCount).toEqual(1);
		// expect(fixture.nativeElement.querySelector('#user-menu-admin-settings')).toBeTruthy();
	});
});
