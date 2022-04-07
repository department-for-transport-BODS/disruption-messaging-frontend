import { Injectable } from '@angular/core';
import { IEnumOverridesObject, IEnumOverridesInput, IUserType, IUserUsageInformationQuery } from 'src/generated/graphql';
import { EnumFormatter } from '../shared/formatters/enum.formatter';
import { EnumValueViewModel, UserUsageInformationViewModel } from './settings.viewmodel';
import { UserMapper } from '../admin/users/user.mapper';

@Injectable({
	providedIn: 'root'
})
export class SettingsViewModelMapper {
	constructor() { }

	toViewModel(enums: IEnumOverridesObject[]): EnumValueViewModel[] {
		const enumsList = enums.map(
			e =>
				({
					currentValues: EnumFormatter.prettifyNames(e.values),
					allValues: EnumFormatter.prettifyNames(e.allValues.filter(f => !e.values.includes(f))),
					type: e.type
				} as EnumValueViewModel)
		);
		const reason = enumsList.find(f => f.type === 'Reason') as EnumValueViewModel;
		return [reason, ...enumsList.filter(item => item.type !== 'Reason')];
	}

	toGraphQLInput(viewmodels: EnumValueViewModel[]): IEnumOverridesInput[] {
		return (
			viewmodels &&
			viewmodels.map(m => {
				const enumValues = m.currentValues.map(cv => EnumFormatter.toEnumString(cv));
				return { type: m.type, values: enumValues } as IEnumOverridesInput;
			})
		);
	}

	toUserUsageViewModel(userUsageInformations: IUserType[]): UserUsageInformationViewModel[] {
		return userUsageInformations.map(user => ({
			id: user.id,
			username: user.username,
			email: user.email,
			organisation: user.organisation ? user.organisation.name : '',
			roles: user.roles
				? user.roles.map(role => UserMapper.getRolePrettyName(role.name, role.scope)).join(', ')
				: '',
			lastLogin: user.lastLogin ? user.lastLogin : '',
			numDisruptionsEntered: user.numDisruptionsEntered,
			numDisruptionsApproved: user.numDisruptionsApproved
		}));
	}
}
