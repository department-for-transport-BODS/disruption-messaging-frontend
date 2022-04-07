import { IOrganisationType, IRoleType } from 'src/generated/graphql';
import { RoleViewModel } from '../admin/users/user.viewmodel';

export class EnumValueViewModel {
	currentValues: string[];
	allValues: string[];
	type: string;
}

export class UserUsageInformationViewModel {
	id: string;
	username: string;
	email: string;
	organisation: string;
	roles: string;
	lastLogin: Date;
	numDisruptionsEntered: number;
	numDisruptionsApproved: number;
}
