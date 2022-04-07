import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationComponent } from './authentication.component';
import { AuthenticationService } from './authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStoreService } from '../user/user.store.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('AuthenticationComponentWithRoutingMock', () => {
	let component: AuthenticationComponent;
	let fixture: ComponentFixture<AuthenticationComponent>;
	let service: AuthenticationService;

	const mockRouter = {
		navigate: jasmine.createSpy('navigate')
	};

	const mockUserStore = {
		isAuthenticated: jasmine.createSpy('isAuthenticated')
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				ApolloTestingModule,
				SharedModule,
				FormsModule,
				RouterTestingModule,
				NgxSpinnerModule],
			declarations: [AuthenticationComponent],
			providers: [
				AuthenticationService,
				{ provide: UserStoreService, useValue: mockUserStore },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AuthenticationComponent);
		component = fixture.componentInstance;
		service = TestBed.get(AuthenticationService);
		fixture.detectChanges();

		spyOn(service, 'login').and.callFake(() => {});
	});

	it('should redirect to dashboard when authenticated', () => {
		mockUserStore.isAuthenticated.and.returnValue(true);
		expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
	});
});

describe('AuthenticationComponent', () => {
	let component: AuthenticationComponent;
	let fixture: ComponentFixture<AuthenticationComponent>;
	let service: AuthenticationService;

	const mockRouter = {
		navigate: jasmine.createSpy('navigate')
	};

	const mockUserStore = {
		isAuthenticated: jasmine.createSpy('isAuthenticated')
	};

	const username = 'username';
	const password = 'super_secure';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				ApolloTestingModule,
				SharedModule,
				FormsModule,
				RouterTestingModule,
				NgxSpinnerModule],
			declarations: [AuthenticationComponent],
			providers: [
				AuthenticationService,
				{ provide: UserStoreService, useValue: mockUserStore },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AuthenticationComponent);
		component = fixture.componentInstance;
		service = TestBed.get(AuthenticationService);
		fixture.detectChanges();

		spyOn(service, 'login').and.callFake(() => {});
		mockRouter.navigate.calls.reset();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set login failed to false on create', () => {
		expect(component.loginFailed).toBe('');
	});

	it('should call auth service login with username and password', () => {
		component.username = username;
		component.password = password;
		component.submit();

		expect(service.login).toHaveBeenCalledWith(username, password);
	});

	it('should not call auth service login if no username', () => {
		component.username = '';
		component.password = '';
		component.submit();
		expect(service.login).toHaveBeenCalledTimes(0);
	});

	it('should not call auth service login if no password', () => {
		component.username = username;
		component.password = '';
		component.submit();
		expect(service.login).toHaveBeenCalledTimes(0);
	});

	it('should set login failed if no password', () => {
		component.username = username;
		component.password = '';
		component.submit();
		expect(component.loginFailed).not.toBe('');
	});

	it('should set login failed if no username', () => {
		component.username = '';
		component.password = password;
		component.submit();
		expect(component.loginFailed).not.toBe('');
	});

	it('should update local login failed when observable updates', () => {
		const obs$ = cold('--a-|', { a: true });
		spyOnProperty(service, 'loginFailure$').and.returnValue(obs$);

		component.ngOnInit();

		obs$.subscribe({
			complete: () => {
				expect(component.loginFailed).not.toBe('');
			}
		});
	});

	it('should not redirect to dashboard when not authenticated', () => {
		mockUserStore.isAuthenticated.and.returnValue(false);
		expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
	});
});
