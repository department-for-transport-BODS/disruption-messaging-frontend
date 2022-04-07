import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { AuthenticationService } from './authentication.service';
import { UserStoreService } from '../user/user.store.service';
import { ILogoutGQL, ILoginGQL } from 'src/generated/graphql';
import {AuthenticationComponent} from './authentication.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('AuthenticationService', () => {
	let service: AuthenticationService;
	let controller: ApolloTestingController;
	let userStore: UserStoreService;

	const successLogin = {
		data: {
			login: {
				success: true,
				errors: null
			}
		}
	};

	const successLogout = {
		data: {
			logout: {
				success: true,
				errors: null
			}
		}
	};

	const failureLogin = {
		data: {
			login: {
				success: false,
				errors: ['An error']
			}
		}
	};

	const failureLogout = {
		data: {
			logout: {
				success: false,
				errors: ['An error']
			}
		}
	};

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				RouterTestingModule.withRoutes([
					{ path: 'login', component: AuthenticationComponent}
				]),
				ApolloTestingModule,
				SharedModule,
				FormsModule,
				NgxSpinnerModule],
			providers: [UserStoreService, ILogoutGQL, ILoginGQL],
			declarations: [AuthenticationComponent]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		userStore = TestBed.get(UserStoreService);
		service = TestBed.get(AuthenticationService);
	});

	afterEach(() => {
		controller.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should create login failure observable as observable', () => {
		expect(service.loginFailure$).toBeDefined();
	});

	it('should set login failed to false by default', () => {
		service.loginFailure$.subscribe(value => expect(value).toBeFalsy());
	});

	it('should call login mutation', () => {
		const username = 'Gill';
		const password = 'ewrwe3242fdsfsd';
		service.login(username, password);

		const op = controller.expectOne('login').operation;

		expect(op.variables.username).toBe(username);
		expect(op.variables.password).toBe(password);
	});

	it('should call user store login', fakeAsync(() => {
		spyOn(userStore, 'login');
		service.login('Gill', 'ewrwe3242fdsfsd');

		// flush operaions to complete async requests.
		controller.expectOne('login').flush(successLogin);
		flush();

		expect(userStore.login).toHaveBeenCalledTimes(1);
		service.loginFailure$.subscribe(val => {
			expect(val).toBeFalsy();
		});
	}));

	it('should not call user store when login failure', fakeAsync(() => {
		spyOn(userStore, 'login');
		service.login('Gill', 'ewrwe3242fdsfsd');

		// flush operaions to complete async requests.
		controller.expectOne('login').flush(failureLogin);
		flush();

		expect(userStore.login).toHaveBeenCalledTimes(0);
		service.loginFailure$.subscribe(val => {
			expect(val).not.toBe('');
		});
	}));

	it('should call logout mutation', () => {
		service.logout();
		expect(controller.expectOne('logout')).toBeTruthy();
	});

	it('should call user store logout', fakeAsync(() => {
		spyOn(userStore, 'logout');
		service.logout();

		controller.expectOne('logout').flush(successLogout);
		flush();

		expect(userStore.logout).toHaveBeenCalledTimes(1);
	}));

	it('should not call user store logout when logout fails', fakeAsync(() => {
		spyOn(userStore, 'logout');
		service.logout();

		controller.expectOne('logout').flush(failureLogout);
		flush();

		expect(userStore.logout).toHaveBeenCalledTimes(0);
	}));
});
