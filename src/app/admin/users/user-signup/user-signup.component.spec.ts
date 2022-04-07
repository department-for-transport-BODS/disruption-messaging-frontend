import {
	ComponentFixture,
	ComponentFixtureAutoDetect,
	TestBed,
} from '@angular/core/testing';

import {UserSignupComponent} from './user-signup.component';
import {SharedModule} from '../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NgxSmartModalModule, NgxSmartModalService} from 'ngx-smart-modal';
import {ReactiveFormsModule} from '@angular/forms';
import {UsersService} from '../users.service';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute} from '@angular/router';
import {IInvitationsType} from '../../../../generated/graphql';

describe('UserSignupComponent', () => {
	let component: UserSignupComponent;
	let fixture: ComponentFixture<UserSignupComponent>;
	let updateForm: (username, password, firstName, lastName, key) => void;
	let updateDefaultForm: () => void;

	const signUpModel = {
		username: 'user-1',
		password: 'password',
		firstName: 'firstName',
		lastName: 'lastName',
		key: '1234'
	};
	let service: UsersService;
	let saveSpy;
	let activatedRoute;
	const invitationModel: IInvitationsType = {key: '1234', id: '1', email: 'foo@bar.com', created: ''};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UserSignupComponent],
			imports: [
				SharedModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				HttpClientTestingModule,
				RouterTestingModule,
				ReactiveFormsModule
			],
			providers: [
				NgxSmartModalService,
				UsersService,
				{provide: ComponentFixtureAutoDetect, useValue: true}]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserSignupComponent);
		service = fixture.debugElement.injector.get(UsersService);
		saveSpy = spyOn(service, 'signUp').and.returnValue(null);

		const obs = cold('-a|', {a: invitationModel});
		spyOn(service, 'invitation').and.returnValue(obs);

		activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
		spyOn(activatedRoute, 'queryParams').and.returnValue({key: '1234'});
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	updateForm = (username, password, firstName, lastName, key)  => {
		component.signUpForm.controls.username.setValue(username);
		component.signUpForm.controls.password.setValue(password);
		component.signUpForm.controls.confirmPassword.setValue(password);
		component.signUpForm.controls.firstName.setValue(firstName);
		component.signUpForm.controls.lastName.setValue(firstName);
		component.signUpForm.controls.key.setValue(key);
	};

	updateDefaultForm = () => {
		updateForm(
			signUpModel.username,
			signUpModel.password,
			signUpModel.firstName,
			signUpModel.lastName,
			signUpModel.key);
	};

	it('should have the default form elements', () => {
		expect(component.username.value).toBeFalsy();
		expect(component.password.value).toBeFalsy();
		expect(component.confirmPassword.value).toBeFalsy();
		expect(component.signUpForm.controls.firstName.value).toBeFalsy();
		expect(component.signUpForm.controls.lastName.value).toBeFalsy();
		expect(component.key.value).toBeFalsy();
	});

	it('should sign up', () => {
		updateDefaultForm();
		component.onSubmit();
		expect(component.username.valid).toBeTruthy();
		expect(component.password.valid).toBeTruthy();
		expect(component.confirmPassword.value).toBeTruthy();
		expect(component.signUpForm.controls.firstName.valid).toBeTruthy();
		expect(component.signUpForm.controls.lastName.valid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalled();
	});

	it('should not sign up when username is not supplied', () => {
		updateDefaultForm();
		component.username.setValue('');
		component.onSubmit();
		expect(component.username.invalid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalledTimes(0);
	});

	it('should not sign up when password is not supplied', () => {
		updateDefaultForm();
		component.password.setValue('');
		component.confirmPassword.setValue('');
		component.onSubmit();
		expect(component.signUpForm.controls.password.invalid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalledTimes(0);
	});

	it('should not sign up when passwords dont match', () => {
		updateDefaultForm();
		component.password.setValue('foo');
		component.confirmPassword.setValue('bar');
		expect(component.signUpForm.errors.confirmPasswordMisMatch).toBeTruthy('Password mismatch error not raised');
		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(0);
	});

	it('shows error banner on server errors', () => {
		getTestScheduler().flush(); // flush() the observables in beforeEach
		component.ngOnInit();
		fixture.detectChanges();

		updateDefaultForm();
		service.errors = 'An error';
		getTestScheduler().flush();
		fixture.detectChanges();
		const banner = fixture.nativeElement.querySelector('.banner--error');
		expect(banner.textContent).toEqual('An error');

	});

	it('shows success banner on success', () => {
		getTestScheduler().flush(); // flush() the observables in beforeEach
		component.ngOnInit();
		fixture.detectChanges();
		updateDefaultForm();

		service.serverResponse = {success: true, errors: null};
		getTestScheduler().flush();
		fixture.detectChanges();
		const banner = fixture.nativeElement.querySelector('#signup-success');
		expect(banner.textContent).toEqual('Signup successful.');
	});
});
