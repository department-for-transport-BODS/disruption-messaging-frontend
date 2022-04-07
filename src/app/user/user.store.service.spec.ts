import { TestBed } from '@angular/core/testing';

import { UserStoreService } from './user.store.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IOrganisationType, IUserGQL, IUserType } from 'src/generated/graphql';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import * as moment from 'moment';
import { IDisruptionNotificationMessageType, IDisruptionNotificationStatus } from 'src/generated/enum-overrides';
import { getTestScheduler } from 'jasmine-marbles';

describe('UserStoreService', () => {
	let service: UserStoreService;
	let controller: ApolloTestingController;
	const nodeconnection: any = {
		totalCount: 10,
		edges: [
			{
				node: {
					id: 'fakeId',
					status: 'A_1' as IDisruptionNotificationStatus,
					sent: moment.now(),
					details: {
						message: 'This notification is a test one.',
						disruption: {
							id: 'RGlzcnVwdGlvbk5vZGU6ODY=',
							title: 'titles, titles, titles'
						},
						type: 'A_1' as IDisruptionNotificationMessageType,
						duplicates: {
							edges: []
						}
					}
				}
			}
		]
	};
	const user: IUserType = {
		id: '1',
		email: 'jane@bloggs.com',
		username: 'bloggs',
		organisation: {
			name: 'support',
			id: '1'
		} as IOrganisationType,
		roles: [],
		disruptionNotifications: nodeconnection,
		capabilities: { enumOverrides: true },
		transmodelRestrictions: null
	};

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientModule, RouterTestingModule, ApolloTestingModule],
			providers: [IUserGQL]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(UserStoreService);
	});

	afterEach(() => {
		controller.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create user subject observable as observable', () => {
		expect(service.user$).toBeDefined();
	});

	it('should not be authenticated by default', () => {
		expect(service.isAuthenticated()).toBeFalsy();
	});

	it('should not be authorised by default', () => {
		expect(service.isAuthorisedForSettings()).toBeFalsy();
	});

	it('should set user as authenticated', () => {
		service.setAuthenticated(user);

		service.user$.subscribe(u => {
			expect(u).toBe(user);
		});

		expect(service.isAuthenticated()).toBeTruthy();
	});

	it('should set user that is authorised for settings', () => {
		service.setAuthenticated(user);

		service.user$.subscribe(u => {
			expect(u).toBe(user);
		});

		expect(service.isAuthorisedForSettings()).toBeTruthy();
	});

	it('should call user query', done => {
		service.login();

		const op = controller.expectOne('user');
		op.flush({
			data: {
				user,
				success: true,
				errors: null
			}
		});

		getTestScheduler().flush();

		service.user$.subscribe(serviceUser => {
			expect(serviceUser).toEqual(user);
			done();
		});
	});

	it('should clear user$ on log out', () => {
		service.setAuthenticated(user);
		service.logout();

		service.user$.subscribe(u => {
			expect(u).toBeNull();
		});
	});
});
