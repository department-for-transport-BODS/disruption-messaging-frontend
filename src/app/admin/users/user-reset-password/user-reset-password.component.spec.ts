import {async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, flush, TestBed} from '@angular/core/testing';

import {UserResetPasswordComponent} from './user-reset-password.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UsersService} from '../users.service';

describe('UserResetPasswordComponent', () => {
	let component: UserResetPasswordComponent;
	let fixture: ComponentFixture<UserResetPasswordComponent>;
	let service: UsersService;
	let saveSpy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserResetPasswordComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				FormsModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule,
			],
			providers: [
				FormBuilder,
				UsersService,
				{provide: ComponentFixtureAutoDetect, useValue: true }
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserResetPasswordComponent);
		service = fixture.debugElement.injector.get(UsersService);
		saveSpy = spyOn(service, 'resetPasswordConfirm').and.returnValue(null);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not reset password when passwords dont match',() => {
		component.password.setValue('foo');
		component.confirmPassword.setValue('bar');
		expect(component.resetPasswordForm.errors.confirmPasswordMisMatch).toBeTruthy('Password mismatch error not raised');
		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(0);
		component.ngOnDestroy();
	});

	it('should not reset password if uid and token are not supplied',() => {
		component.password.setValue('foo');
		component.confirmPassword.setValue('foo');
		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(0);
		component.ngOnDestroy();
	});

	it('should reset password', () => {
		component.password.setValue('foo');
		component.confirmPassword.setValue('foo');
		component.uid.setValue('uid');
		component.token.setValue('token');

		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(1);
		component.ngOnDestroy();
	});
});
