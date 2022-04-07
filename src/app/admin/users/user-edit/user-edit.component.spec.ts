import { ComponentFixture, ComponentFixtureAutoDetect, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersService } from '../users.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { UserMapper } from '../user.mapper';
import { OrganisationService } from '../../organisation/organisation.service';
import { OrganisationModule } from '../../organisation/organisation.module';
import { IOrganisationType, IRoleType, IUserType } from 'src/generated/graphql';
import { IRoleScope } from '../../../../generated/enum-overrides';
import { UserViewModel } from '../user.viewmodel';
import { UserStoreService } from '../../../user/user.store.service';
import { Observable } from 'rxjs';

describe('UserEditComponent', () => {
	let component: UserEditComponent;
	let fixture: ComponentFixture<UserEditComponent>;
	let updateForm: (id, username, email, organisation, role) => void;
	let updateDefaultForm: () => void;
	let service: UsersService;
	let orgService: OrganisationService;
	let mapperService: UserMapper;
	let userStoreService: UserStoreService;
	let saveSpy;
	let userObs: Observable<IUserType>;

	const userModel: IUserType = {
		id: '1',
		username: 'user-1',
		email: 'user@foo.com',
		organisation: { name: 'organisation-1', id: '1', created: '', modified: '' } as IOrganisationType,
		roles: [{ id: '1', name: 'Administrator', scope: IRoleScope.SYS, created: '', modified: '' } as IRoleType]
	};

	const currentUserModel: IUserType = {
		id: '2',
		username: 'current_user',
		email: 'current_user@test.com',
		organisation: { name: 'current_user_organisation', id: '2', created: '', modified: '' } as IOrganisationType,
		roles: [{ id: '1', name: 'Administrator', scope: IRoleScope.ORG, created: '', modified: '' } as IRoleType]
	};

	let viewModel: UserViewModel;

	beforeEach(() => {
		TestBed.configureTestingModule({
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
				OrganisationModule
			],
			declarations: [UserEditComponent],
			providers: [
				FormBuilder,
				UsersService,
				OrganisationService,
				UserMapper,
				{ provide: ComponentFixtureAutoDetect, useValue: true }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserEditComponent);
		service = fixture.debugElement.injector.get(UsersService);
		orgService = fixture.debugElement.injector.get(OrganisationService);
		mapperService = fixture.debugElement.injector.get(UserMapper);
		userStoreService = fixture.debugElement.injector.get(UserStoreService);
		viewModel = mapperService.getModel(userModel);
		saveSpy = spyOn(service, 'save').and.returnValue(null);
		userObs = cold('--a|', {a: currentUserModel});
		spyOnProperty(userStoreService, 'user$', 'get').and.returnValue(userObs);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	updateForm = (id, username, email, organisation, role) => {
		/*
		Note: If you want to call this method you need to make sure that
		component.ngOnInit is called first, this will set up the currentUserSubscription
		then you need to flush the observables to set the currentUser. ie

		component.ngOnInit();
		getTestScheduler().flush();
		updateForm(args);
		 */
		component.userForm.controls.id.setValue(id);
		component.userForm.controls.username.setValue(username);
		component.userForm.controls.email.setValue(email);
		component.userForm.controls.organisation.setValue(organisation);
		component.userForm.controls.role.setValue(role[0]);
	};

	updateDefaultForm = () => {
		/*
		Note: If you want to call this method you need to make sure that
		component.ngOnInit is called first, this will set up the currentUserSubscription
		then you need to flush the observables to set the currentUser. ie

		component.ngOnInit();
		getTestScheduler().flush();
		updateDefaultForm(args);
		*/
		updateForm(userModel.id, userModel.username, userModel.email, userModel.organisation, userModel.roles);
	};

	it('should have the default form elements', () => {
		expect(component.userForm.controls.username.value).toBeFalsy();
		expect(component.userForm.controls.email.value).toBeFalsy();
		expect(component.userForm.controls.organisation.value).toBeFalsy();
		expect(component.userForm.controls.role.value).toBeFalsy();
	});

	it('should call save on submit', () => {
		component.ngOnInit();
		getTestScheduler().flush(); // flush the observables
		updateDefaultForm();
		component.onSubmit();
		expect(component.userForm.controls.username.valid).toBeTruthy();
		expect(component.userForm.controls.email.valid).toBeTruthy();
		expect(component.userForm.controls.organisation.valid).toBeTruthy();
		expect(component.userForm.controls.role.valid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalled();
	});

	it('should call set email to lowercase on submit', () => {
		component.ngOnInit();
		getTestScheduler().flush(); // flush the observables
		updateDefaultForm();
		component.userForm.controls.email.setValue('ALLCAPS@email.com');
		component.onSubmit();

		expect(component.userForm.controls.email.value).toBe('allcaps@email.com');

		expect(saveSpy).toHaveBeenCalled();
	});

	it('should not call submit when email is invalid', () => {
		component.ngOnInit();
		getTestScheduler().flush(); // flush the observables
		updateForm(userModel.id, userModel.username, 'invalid-email', userModel.organisation, userModel.roles);
		component.onSubmit();
		expect(component.userForm.controls.email.invalid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalledTimes(0);
	});

	it('should disable username control ', () => {
		const obs = cold('--a|', { a: viewModel });
		const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);

		component.ngOnInit();
		getTestScheduler().flush(); // flush the observables
		updateDefaultForm();

		expect(spy).toHaveBeenCalled();

		expect(component.username.status).toEqual('DISABLED', 'Expected username control to be disabled');

		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalled();
	});

	it('should not call submit when role is not supplied', () => {
		const obs = cold('--a|', { a: viewModel });
		const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);

		component.ngOnInit();
		getTestScheduler().flush();

		updateForm(userModel.id, userModel.username, userModel.email, userModel.organisation, '');
		component.onSubmit();

		expect(spy).toHaveBeenCalled();
		expect(component.userForm.controls.role.invalid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalledTimes(0);
	});

	it('should call submit when organisation is not supplied', () => {
		const obs = cold('--a|', { a: viewModel });
		const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);

		// ngOnInit will make the component subscribe to selectedUser
		spyOn(service, 'allRoles').and.returnValue(null);
		spyOn(orgService, 'list').and.returnValue(null);
		// Listen for value changes on the form and assert values.
		component.ngOnInit();
		getTestScheduler().flush();
		updateForm(userModel.id, userModel.username, userModel.email, '', userModel.roles);
		component.onSubmit();

		fixture.detectChanges();
		expect(spy).toHaveBeenCalled();
		expect(component.userForm.controls.organisation.valid).toBeTruthy();
		expect(saveSpy).toHaveBeenCalledTimes(1);
	});

	it('should update form controls for the edit case', () => {
		const obs = cold('--a|', { a: viewModel });
		const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);

		component.ngOnInit();
		getTestScheduler().flush();

		expect(spy).toHaveBeenCalled();
		expect(component.email.value).toEqual(viewModel.email);
		expect(component.organisation.value).toEqual(viewModel.organisation);
		expect(component.role.value.prettyName).toEqual(viewModel.roleDisplay);
	});

	it('should update form controls for the invite case', () => {
		const obs = cold('--a|', { a: null });
		// Feed a selected organisation via a marble observable
		const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);
		// ngOnInit will make the component subscribe to selectedUser
		component.ngOnInit();
		expect(spy).toHaveBeenCalled();
		getTestScheduler().flush();

		expect(component.username.value).toEqual(null);
		expect(component.email.value).toEqual(null);
		expect(component.organisation.value).toEqual(null);
		expect(component.role.value).toEqual(null);
	});

	it('should populate organisation dropdown', () => {
		const organisation = {
			name: 'Organisation - 1'
		};
		const obs = cold('--a|', { a: [organisation] });
		const spy = spyOn(orgService, 'list').and.returnValue(obs);
		spyOn(service, 'allRoles').and.returnValue(null);
		component.ngOnInit();
		getTestScheduler().flush();

		expect(spy).toHaveBeenCalled();
	});

	it('should populate roles dropdown', () => {
		const role = {
			name: 'Administrator',
			scope: IRoleScope.SYS
		};
		const obs = cold('--a|', { a: [role] });
		const spy = spyOn(service, 'allRoles').and.returnValue(obs);
		spyOn(orgService, 'list').and.returnValue(null);
		component.ngOnInit();
		getTestScheduler().flush();

		expect(spy).toHaveBeenCalled();
	});

	it('shows banner on user errors', fakeAsync(() => {
		service.errors = 'An error';
		flush();
		fixture.detectChanges();
		const banner = fixture.nativeElement.querySelector('dm-banner');
		expect(banner.childNodes[0].textContent).toEqual('An error');
	}));
});
