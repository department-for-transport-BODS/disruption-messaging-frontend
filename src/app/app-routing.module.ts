import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisruptionsListComponent } from './disruptions-list/disruptions-list.component';
import { ReviewsListComponent } from './reviews-list/reviews-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './user/auth-guard.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { EditDisruptionComponent } from './disruption/edit/edit-disruption.component';
import { ViewDisruptionComponent } from './disruption/view/view-disruption.component';
import { UserSignupComponent } from './admin/users/user-signup/user-signup.component';
import { UserPasswordComponent } from './admin/users/user-password/user-password.component';
import { UserForgotPasswordComponent } from './admin/users/user-forgot-password/user-forgot-password.component';
import { UserResetPasswordComponent } from './admin/users/user-reset-password/user-reset-password.component';
import { NotificationSettingsComponent } from './admin/users/notification-settings/notification-settings.component';
import { AdminComponent } from './admin/admin.component';
import { SettingsComponent } from './settings/settings.component';
import { RoleGuardService } from './user/role-guard.service';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
	{ path: 'disruptions', component: DisruptionsListComponent, canActivate: [AuthGuardService] },
	{ path: 'disruptions/templates', component: DisruptionsListComponent, canActivate: [AuthGuardService] },
	{ path: 'reviews', component: ReviewsListComponent, canActivate: [AuthGuardService] },
	{ path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
	{ path: 'disruption/edit/:id', component: EditDisruptionComponent, canActivate: [AuthGuardService] },
	{ path: 'disruption/edit', component: EditDisruptionComponent, canActivate: [AuthGuardService] },
	{ path: 'invitations/accept-invite/:key', component: UserSignupComponent },
	{ path: 'disruption/:id', component: ViewDisruptionComponent, canActivate: [AuthGuardService] },
	{ path: 'change-password', component: UserPasswordComponent, canActivate: [AuthGuardService] },
	{ path: 'forgot-password', component: UserForgotPasswordComponent },
	{ path: 'password-reset/:uid/:token', component: UserResetPasswordComponent },
	{
		path: 'notification-settings',
		component: NotificationSettingsComponent,
		canActivate: [AuthGuardService]
	},
	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService, RoleGuardService] },
	{ path: 'support', component: SupportComponent },
	{ path: 'login', component: AuthenticationComponent },
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
