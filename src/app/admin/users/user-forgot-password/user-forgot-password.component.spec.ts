import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserForgotPasswordComponent } from './user-forgot-password.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersService } from '../users.service';

describe('UserForgotPasswordComponent', () => {
	let component: UserForgotPasswordComponent;
	let fixture: ComponentFixture<UserForgotPasswordComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserForgotPasswordComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				FormsModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule
			],
			providers: [FormBuilder, UsersService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserForgotPasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
