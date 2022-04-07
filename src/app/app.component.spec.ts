import { TestBed, async, ComponentFixture, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { UserStoreService } from './user/user.store.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DisruptionsListModule } from './disruptions-list/disruptions-list.module';
import { ReviewsListModule } from './reviews-list/reviews-list.module';
import { SharedModule } from './shared/shared.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { IOrganisationType, IUserType } from 'src/generated/graphql';
import { cold } from 'jasmine-marbles';
import { EditDisruptionModule } from './disruption/edit/edit-disruption.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ViewDisruptionModule } from './disruption/view/view-disruption.module';
import * as moment from 'moment';
import { OrganisationModule } from './admin/organisation/organisation.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { UsersModule } from './admin/users/users.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MenuModule } from './menu/menu.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { SupportModule } from './support/support.module';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('AppComponent', () => {
	let app: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let userStore: UserStoreService;

	const mockRouter = {
		get url() {
			return '/login';
		},
		navigate: jasmine.createSpy('navigate')
	};

	const user: IUserType = {
		id: '1',
		username: 'support',
		organisation: {
			id: '1',
			name: 'name',
			created: moment(),
			modified: moment()
		} as IOrganisationType,
		email: 'fake@email.com'
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				FormsModule,
				AngularSvgIconModule,
				HttpClientModule,
				MenuModule,
				RouterModule,
				DisruptionsListModule,
				ReviewsListModule,
				SharedModule,
				ApolloTestingModule,
				DashboardModule,
				EditDisruptionModule,
				ViewDisruptionModule,
				OrganisationModule,
				SupportModule,
				UsersModule,
				NgxSmartModalModule.forRoot(),
				HttpClientTestingModule,
				AdminModule,
				SettingsModule,
				NgxSpinnerModule
			],
			declarations: [AppComponent, AuthenticationComponent, PageNotFoundComponent],
			providers: [UserStoreService, { provide: Router, useValue: mockRouter }]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
		fixture.detectChanges();

		userStore = TestBed.get(UserStoreService);
	}));

	afterEach(() => {
		mockRouter.navigate.calls.reset();
	});

	it('should route to dashboard when user logs in', () => {
		const obs$ = cold('a|', { a: user });
		spyOnProperty(userStore, 'user$').and.returnValue(obs$);

		app.ngOnInit();

		obs$.subscribe({
			complete: () => {
				expect(mockRouter.navigate).toHaveBeenCalledWith(['dashboard']);
			}
		});
	});

	it('should be authenticated after user is set', () => {
		const obs$ = cold('a|', { a: user });
		spyOnProperty(userStore, 'user$').and.returnValue(obs$);

		app.ngOnInit();

		obs$.subscribe({
			complete: () => {
				expect(app.authenticated()).toBeTruthy();
			}
		});
	});

	it('should not be authenticated on init', () => {
		expect(app.authenticated()).toBeFalsy();
	});
});

// TODO investigate why the mock property on router cannot be properly spy'd on.

describe('AppComponentWithDifferentMockRouter', () => {
	let app: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let userStore: UserStoreService;

	const mockRouter = {
		get url() {
			return '/create';
		},
		navigate: jasmine.createSpy('navigate')
	};

	const user: IUserType = {
		id: '1',
		username: 'support',
		organisation: {
			id: '1',
			name: 'name',
			created: moment(),
			modified: moment()
		} as IOrganisationType,
		email: 'fake@email.com'
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				FormsModule,
				AngularSvgIconModule,
				HttpClientModule,
				MenuModule,
				RouterModule,
				DisruptionsListModule,
				ReviewsListModule,
				SharedModule,
				SupportModule,
				ApolloTestingModule,
				DashboardModule,
				EditDisruptionModule,
				ViewDisruptionModule,
				AdminModule,
				OrganisationModule,
				UsersModule,
				SettingsModule,
				NgxSpinnerModule
			],
			declarations: [AppComponent, AuthenticationComponent, PageNotFoundComponent],
			providers: [UserStoreService, { provide: Router, useValue: mockRouter }]
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
		fixture.detectChanges();

		userStore = TestBed.get(UserStoreService);
	}));

	afterEach(() => {
		mockRouter.navigate.calls.reset();
	});

	it('should not redirect when user is set and not on login page', fakeAsync(() => {
		const obs$ = cold('a|', { a: user });

		spyOnProperty(userStore, 'user$').and.returnValue(obs$);

		app.ngOnInit();

		obs$.subscribe({
			complete: () => {
				expect(mockRouter.navigate).toHaveBeenCalledTimes(0);
			}
		});

		flush();
	}));
});
