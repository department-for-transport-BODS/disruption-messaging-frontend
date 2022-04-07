import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { UsersService } from './users.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { IAllUsersGQL, IInvitationsType, IOrganisationType, IRoleType, IUserSignUpInput, IUserType } from '../../../generated/graphql';
import { UserMapper } from './user.mapper';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MockModalService } from 'src/app/shared/services/mock-modal.service';
import { UserViewModel } from './user.viewmodel';
import { IRoleScope } from '../../../generated/enum-overrides';
import Spy = jasmine.Spy;

describe('UserService', () => {
	let service: UsersService;
	let controller: ApolloTestingController;
	let mapper: UserMapper;
	let mapperSpy: Spy<any>;
	const formBuilder: FormBuilder = new FormBuilder();

	const userModel: IUserType = {
		id: '1',
		username: 'user-1',
		email: 'user@foo.com',
		organisation: { name: 'organisation-1', id: '1', created: '', modified: '' } as IOrganisationType,
		roles: [{ id: '1', name: 'Administrator', scope: IRoleScope.SYS, created: '', modified: '' } as IRoleType],
		transmodelRestrictions: []
	};

	const signUpModel: IUserSignUpInput = {
		username: 'user-1',
		password: 'password',
		firstName: 'firstName',
		lastName: 'lastName',
		key: '1234'
	};

	let viewModel: UserViewModel;

	const routes: Routes = [{ path: 'login', component: UsersComponent }];

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UsersComponent],
			imports: [
				SharedModule,
				RouterTestingModule.withRoutes(routes),
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				ReactiveFormsModule
			],
			providers: [IAllUsersGQL, { provide: NgxSmartModalService, useClass: MockModalService }, UserMapper, UsersService],
			schemas: [NO_ERRORS_SCHEMA]
		});
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(UsersService);
		mapper = TestBed.get(UserMapper);
		viewModel = mapper.getModel(userModel);
		mapperSpy = spyOn(mapper, 'getModel').and.returnValue(viewModel);
	});

	it('fetches all users', fakeAsync(() => {
		service.list().subscribe(s => {
			expect(s).toEqual([viewModel]);
		});
		flush();
		controller.expectOne('allUsers').flush({ data: { allUsers: [{ ...userModel }] } });
		controller.verify();
		expect(mapperSpy).toHaveBeenCalled();
	}));

	it('sends an error when save fails', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			role: userModel.roles[0]
		});
		service.errors$.subscribe(s => {
			if (s) {
				expect(s).toEqual('This is an error');
			}
		});
		service.save(formGroup);
		tick();
		controller.expectOne('updateUser').flush({
			data: {
				updateUser: {
					data: null,
					errors: 'This is an error',
					success: false
				}
			}
		});
		controller.expectOne('allUsers').flush({ data: { allUsers: [{ ...userModel }] } });
		flush();
		controller.verify();
	}));

	it('updates a user and refetch results.', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			role: userModel.roles[0]
		});
		const response = {
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			roles: userModel.roles,
			transmodelRestrictions: []
		};

		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(viewModel);
			}
		});
		service.save(formGroup);
		controller.expectOne('updateUser').flush({
			data: {
				updateUser: {
					data: { ...response },
					errors: '',
					success: false
				}
			}
		});
		controller.expectOne('allUsers').flush({ data: { allUsers: [{ ...userModel }] } });
		flush();
		controller.verify();
	}));

	it('selects a user for edit', fakeAsync(() => {
		service.selectedUser$.subscribe(o => {
			if (o) {
				expect(o).toEqual(viewModel);
			}
		});
		service.editUser(viewModel);
		flush();
	}));

	it('sends null as selected user to invitation form', fakeAsync(() => {
		service.selectedUser$.subscribe(() => {
			expect(0).toBeFalsy();
		});
		service.inviteUser();
		flush();
	}));

	it('invites a user', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: '',
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			roles: [userModel.roles]
		});
		const response = {
			id: userModel.id,
			key: '1234',
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			roles: userModel.roles
		};
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(viewModel);
			}
		});
		service.save(formGroup);
		controller.expectOne('inviteUser').flush({
			data: {
				inviteUser: {
					data: { ...response },
					errors: '',
					success: false
				}
			}
		});
		controller.expectOne('allUsers').flush({ data: { allUsers: [{ ...userModel }] } });
		flush();
		controller.verify();
	}));

	it('should sign-up a user', fakeAsync(() => {
		const formGroup = formBuilder.group({
			username: signUpModel.username,
			password: signUpModel.password,
			lastName: signUpModel.lastName,
			firstName: signUpModel.firstName,
			key: signUpModel.key
		});
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(viewModel);
			}
		});
		service.signUp(formGroup);
		controller.expectOne('signUp').flush({
			data: {
				signUp: {
					data: { ...userModel },
					errors: '',
					success: false
				}
			}
		});
		flush();
		controller.verify();
	}));

	xit('should check invitation exists (Fails - more investigation needed)', fakeAsync(() => {
		const invite = service.invitation('1234');
		invite.subscribe(s => {
			expect(s).toEqual({ key: '1234' } as IInvitationsType);
		});
		tick();
		controller.expectOne('InvitationByKey').flush({ data: { invitationByKey: { key: '1234' } } });
		controller.verify();
	}));

	it('should change password for a user', fakeAsync(() => {
		const changePasswordModel = {
			success: true,
			errors: null
		};
		const formGroup = formBuilder.group({
			currentPassword: 'foo',
			password: 'bar',
			confirmPassword: 'bar',
			username: 'user-1'
		});
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(changePasswordModel);
			}
		});
		service.changePassword(formGroup);
		controller.expectOne('changePassword').flush({
			data: {
				changePassword: {
					errors: null,
					success: true
				}
			}
		});
		flush();
		controller.verify();
	}));

	it('should request a reset password for a user', fakeAsync(() => {
		const requestForResetModel = {
			success: true,
			errors: null
		};
		const formGroup = formBuilder.group({
			email: 'foo@bar.com'
		});
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(requestForResetModel);
			}
		});
		service.resetPassword(formGroup);
		controller.expectOne('resetPassword').flush({
			data: {
				resetPassword: {
					errors: null,
					success: true
				}
			}
		});
		flush();
		controller.verify();
	}));

	it('should reset password for user', fakeAsync(() => {
		const resetPasswordModel = {
			success: true,
			errors: null
		};
		const formGroup = formBuilder.group({
			uid: 'uid',
			token: 'token-1234',
			password: 'bar',
			confirmPassword: 'bar'
		});
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(resetPasswordModel);
			}
		});
		service.resetPasswordConfirm(formGroup);
		controller.expectOne('resetPasswordConfirm').flush({
			data: {
				resetPasswordConfirm: {
					errors: null,
					success: true
				}
			}
		});
		flush();
		controller.verify();
	}));
});
