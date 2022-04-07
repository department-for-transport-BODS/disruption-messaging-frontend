import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
	IAllRolesGQL,
	IAllUsersGQL,
	IUserInput,
	IRoleType,
	IUpdateUserGQL,
	IUserType,
	IInviteUserGQL,
	IInvitationCreateInput,
	ISignUpGQL,
	IDeleteUserGQL,
	IInvitationByKeyGQL,
	IInvitationsType,
	IChangePasswordGQL,
	IResetPasswordGQL,
	IResetPasswordConfirmGQL
} from '../../../generated/graphql';
import { map, catchError } from 'rxjs/operators';
import { UserMapper } from './user.mapper';
import { RoleViewModel, UserViewModel } from './user.viewmodel';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStoreService } from '../../user/user.store.service';
import { ApiService } from '../../shared/services/api.service';
import { MutationResponse } from '../../shared/types/graphql';

@Injectable({
	providedIn: 'root'
})
export class UsersService
		extends ApiService<IUserType, UserViewModel, IInvitationCreateInput, IUserInput> {

	private editMode: string;

	constructor(
		private listGQL: IAllUsersGQL,
		private updateGQL: IUpdateUserGQL,
		private inviteGQL: IInviteUserGQL,
		private allRolesGQL: IAllRolesGQL,
		private signUpGQL: ISignUpGQL,
		private deleteGQL: IDeleteUserGQL,
		private invitationGQL: IInvitationByKeyGQL,
		private passwordGQL: IChangePasswordGQL,
		private resetPasswordGQL: IResetPasswordGQL,
		private resetPasswordConfirmGQL: IResetPasswordConfirmGQL,
		private modalService: NgxSmartModalService,
		private routerService: Router,
		private userStoreService: UserStoreService,
		private mapperService: UserMapper
	) {
		super(listGQL, inviteGQL, updateGQL, deleteGQL, mapperService);
	}

	allRoles(): Observable<RoleViewModel[]> {
		return this.allRolesGQL
			.watch()
			.valueChanges
			.pipe(
				map(result =>
					result.data && result.data.allRoles.map(role => UserMapper.getRoleModel(role as IRoleType))));
	}

	get selectedUser$() {
		return this.selectForEdit$();
	}

	get deleteUser$() {
		return this.selectForDelete$();
	}

	invitation(key: string): Observable<IInvitationsType> {
		return this.invitationGQL
			.watch({ key })
			.valueChanges
			.pipe(
				map(res => {
					if (!res.data) { return null; }
					if (res.data.invitationByKey === null) {
						return { key: null } as IInvitationsType;
					} else {
						return res.data.invitationByKey as IInvitationsType;
					}
				}),
				catchError(error => {
					this.errors = error;
					return of({ key: null } as IInvitationsType);
				})
		);
	}

	editUser(user: UserViewModel) {
		this.editMode = 'userEditModal';
		this.selectForEdit = user;

		this.modalService.getModal(this.editMode).open();
	}

	viewUserProfile(user: UserViewModel) {
		this.editMode = 'viewUserModal';
		this.selectForEdit = user;
		this.modalService.getModal(this.editMode).open();
	}

	inviteUser() {
		this.editMode = 'userEditModal';
		this.selectForEdit = null;
		this.modalService.getModal(this.editMode).open();
	}

	signUp(form: FormGroup) {
		const params = UserMapper.getSignUpInput(form);
		this.signUpGQL
			.mutate({ params })
			.subscribe(
				res => this.responseHandler(res as MutationResponse<IUserType>),
				({ networkError }) => this.errorHandler(networkError)
			);
	}

	changePassword(form: FormGroup) {
		const params = UserMapper.getChangePasswordInput(form);
		this.passwordGQL.mutate({ ...params }).subscribe(
			res => {
				this.responseHandler(res as MutationResponse<IUserType>);
				if (res.data.changePassword.success) {
					this.userStoreService.logout();
					setTimeout(() => this.routerService.navigate(['/login']), 2000);
				}
			},
			({ networkError }) => this.errorHandler(networkError)
		);
	}

	resetPassword(form: FormGroup) {
		const params = UserMapper.getResetPasswordInput(form);
		this.resetPasswordGQL.mutate({ ...params }).subscribe(
			res => {
				this.responseHandler(res as MutationResponse<IUserType>);
			},
			({ networkError }) => this.errorHandler(networkError)
		);
	}

	resetPasswordConfirm(form: FormGroup) {
		const params = UserMapper.getResetPasswordConfirmInput(form);
		this.resetPasswordConfirmGQL.mutate({ ...params }).subscribe(
			res => {
				this.responseHandler(res as MutationResponse<IUserType>);
			},
			({ networkError }) => this.errorHandler(networkError)
		);
	}

	deleteUser(user: UserViewModel) {
		this.selectForDelete = user;
		this.modalService.getModal('userDeleteModal').open();
	}

	public save(form: FormGroup) {
		const id = form.get('id').value;
		if (id) {
			const params = this.mapperService.getMutationInput(form);
			return this.update(id, params);
		} else {
			const params = UserMapper.getInvitationInput(form);
			return this.create(params);
		}
	}

	public modalClose() {
		this.modalService.getModal(this.editMode).close();
		this.resetSubjects();
	}

	public deleteModalClose() {
		this.modalService.getModal('userDeleteModal').close();
		this.resetSubjects();
	}
}
