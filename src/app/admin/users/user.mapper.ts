import { Injectable } from '@angular/core';
import {
	IChangePasswordMutationVariables,
	IInvitationCreateInput,
	IResetPasswordConfirmMutationVariables,
	IResetPasswordMutationVariables,
	IRoleType,
	IUserInput,
	IUserSignUpInput,
	IUserType,
	ITransModelRestrictionsType,
	ITransModelRestrictionsObject,
	ITransModelRestrictionsInput,
	IRestrictionEnum
} from 'src/generated/graphql';
import { RoleViewModel, UserViewModel } from './user.viewmodel';
import { FormGroup } from '@angular/forms';
import { TransModelLineViewMapper } from 'src/app/shared/components/transport-data/transmodel.view.mapper';
import { ViewModelMapper } from '../../shared/types/viewmodel-mapper';
import { GraphQLMapper } from '../../shared/types/graphql-mapper';
import { IRoleScope } from '../../../generated/enum-overrides';

@Injectable({
	providedIn: 'root'
})
export class UserMapper implements ViewModelMapper<IUserType, UserViewModel>, GraphQLMapper<IUserInput> {
	static getInvitationInput(userForm: FormGroup): IInvitationCreateInput {
		const role = userForm.get('role');
		const roles = role && role.value ? [role.value] : [];
		const organisation = userForm.get('organisation') ? userForm.get('organisation').value : null;
		return {
			email: userForm.get('email').value,
			organisation: organisation ? { id: userForm.get('organisation').value.id } : null,
			roles: roles.map(r => ({ id: r.id }))
		};
	}

	static getSignUpInput(signUpForm: FormGroup): IUserSignUpInput {
		return {
			username: signUpForm.get('username').value,
			password: signUpForm.get('password').value,
			firstName: signUpForm.get('firstName').value || '',
			lastName: signUpForm.get('lastName').value || '',
			key: signUpForm.get('key').value
		};
	}

	static getChangePasswordInput(passwordForm: FormGroup): IChangePasswordMutationVariables {
		return {
			newPassword: passwordForm.get('password').value,
			oldPassword: passwordForm.get('currentPassword').value,
			username: passwordForm.get('username').value
		};
	}

	static getResetPasswordInput(resetPasswordForm: FormGroup): IResetPasswordMutationVariables {
		return {
			email: resetPasswordForm.get('email').value
		};
	}

	static getResetPasswordConfirmInput(confirmResetForm: FormGroup): IResetPasswordConfirmMutationVariables {
		return {
			uid: confirmResetForm.get('uid').value,
			token: confirmResetForm.get('token').value,
			password: confirmResetForm.get('password').value,
			confirmPassword: confirmResetForm.get('confirmPassword').value
		};
	}

	static getRoleModel(gqlNode: IRoleType): RoleViewModel {
		return {
			id: gqlNode.id,
			name: gqlNode.name,
			scope: gqlNode.scope,
			prettyName: UserMapper.getRolePrettyName(gqlNode.name, gqlNode.scope)
		};
	}

	static getRolePrettyName(name, scope: IRoleScope) {
		return IRoleScope[scope] + ' ' + name;
	}

	getModel(gqlNode: IUserType): UserViewModel {
		return {
			id: gqlNode.id,
			username: gqlNode.username,
			email: gqlNode.email,
			organisation: gqlNode.organisation,
			organisationDisplay: gqlNode.organisation ? gqlNode.organisation.name : null,
			role: gqlNode.roles && gqlNode.roles[0],
			roleDisplay: gqlNode.roles
				? gqlNode.roles.map(role => UserMapper.getRolePrettyName(role.name, role.scope)).join(', ')
				: '',
			restrictedLines:
				gqlNode.transmodelRestrictions &&
				gqlNode.transmodelRestrictions
					.filter(f => f.type === ITransModelRestrictionsType.Li)
					.map(m => {
						const vm = TransModelLineViewMapper.toTransModelLineViewModel({
							featureName: m.name,
							entityId: m.entityId
						});
						vm.type = IRestrictionEnum.Line;
						return vm;
					}),
			restrictedOperators:
				gqlNode.transmodelRestrictions &&
				gqlNode.transmodelRestrictions.filter(f => f.type === ITransModelRestrictionsType.Op)
		};
	}

	getMutationInput(userForm: FormGroup): IUserInput {
		const role = userForm.get('role');
		const roles = role && role.value ? [role.value] : [];
		const organisation = userForm.get('organisation') ? userForm.get('organisation').value : null;
		const opRestrictions = userForm.get('restrictedOperators')
			? (userForm.get('restrictedOperators').value as ITransModelRestrictionsObject[])
			: [];
		const restrictions: ITransModelRestrictionsInput[] = [];
		if (opRestrictions && opRestrictions.length) {
			opRestrictions.map(m =>
				restrictions.push({
					type: IRestrictionEnum.Operator,
					name: m.name,
					entityId: m.entityId
				} as ITransModelRestrictionsInput)
			);
		}
		const lineRestrictions = userForm.get('restrictedLines') ? userForm.get('restrictedLines').value : [];
		if (lineRestrictions && lineRestrictions.length) {
			lineRestrictions.map((m: { featureName: string; entityId: string }) =>
				restrictions.push({
					type: IRestrictionEnum.Line,
					name: m.featureName,
					entityId: m.entityId
				} as ITransModelRestrictionsInput)
			);
		}

		return {
			username: userForm.get('username').value,
			email: userForm.get('email').value,
			organisation: organisation ? { id: userForm.get('organisation').value.id } : null,
			roles: roles.map(r => ({ id: r.id })),
			transmodelRestrictions: restrictions
		};
	}
}
