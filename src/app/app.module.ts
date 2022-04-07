import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { AppInitService } from './app-init.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuardService } from './user/auth-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { IUserGQL } from 'src/generated/graphql';
import { UserStoreService } from './user/user.store.service';

import { DashboardModule } from './dashboard/dashboard.module';
import { ReviewsListModule } from './reviews-list/reviews-list.module';
import { OrganisationModule } from './admin/organisation/organisation.module';
import { DisruptionsListModule } from './disruptions-list/disruptions-list.module';
import { EditDisruptionModule } from './disruption/edit/edit-disruption.module';
import { ViewDisruptionModule } from './disruption/view/view-disruption.module';
import { DeleteDisruptionModule } from './disruption/delete/delete-disruption.module';

import { SharedModule } from './shared/shared.module';
import { MenuModule } from './menu/menu.module';
import { UsersModule } from './admin/users/users.module';
import { AdminModule } from './admin/admin.module';
import { SocialModule } from './social/social.module';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { ConfigService } from './config.service';
import { RoleGuardService } from './user/role-guard.service';
import { SettingsModule } from './settings/settings.module';
import { SupportModule } from './support/support.module';
import { AuthenticationService } from './authentication/authentication.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

export function initializeApp(appInitService: AppInitService) {
	return (): Promise<any> => {
		return appInitService.Init();
	};
}

@NgModule({
	declarations: [AppComponent, PageNotFoundComponent, AuthenticationComponent],
	imports: [
		BrowserModule,
		FormsModule,
		AppRoutingModule,
		HttpClientModule,
		DashboardModule,
		ReviewsListModule,
		OrganisationModule,
		DisruptionsListModule,
		EditDisruptionModule,
		ViewDisruptionModule,
		DeleteDisruptionModule,
		SocialModule,
		SharedModule,
		MenuModule,
		UsersModule,
		SupportModule,
		AdminModule,
		NgxSmartModalModule.forRoot(),
		ApolloModule,
		HttpLinkModule,
		SettingsModule,
		NgxSpinnerModule
	],
	providers: [
		ConfigService,
		AppInitService,
		RoleGuardService,
		AuthGuardService,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [AppInitService, UserStoreService, IUserGQL, ConfigService, Apollo, HttpLink],
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor() {
	}
}
