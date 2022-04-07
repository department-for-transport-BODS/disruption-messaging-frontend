import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSignupComponent } from './user-signup/user-signup.component';
import { UserPasswordComponent } from './user-password/user-password.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';
import { NotificationSettingsComponent } from './notification-settings//notification-settings.component';

@NgModule({
	declarations: [
		UsersComponent,
		UserListComponent,
		UserEditComponent,
		UserDeleteComponent,
		UserSignupComponent,
		UserPasswordComponent,
		UserForgotPasswordComponent,
		UserResetPasswordComponent,
		NotificationSettingsComponent
	],
	imports: [CommonModule, SharedModule, NgxSmartModalModule.forRoot(), NgSelectModule, ReactiveFormsModule],
	exports: [UsersComponent, UserEditComponent]
})
export class UsersModule {}
