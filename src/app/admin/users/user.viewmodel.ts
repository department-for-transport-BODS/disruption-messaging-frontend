import { IOrganisationType, IRoleType, ITransModelRestrictionsObject } from 'src/generated/graphql';
import { TransModelLineViewModel } from 'src/app/shared/components/transport-data/transmodel.view.model';
import { IRoleScope } from '../../../generated/enum-overrides';

export interface UserViewModel {
	// This class represents a single (readonly) row in the user list
	id: string;
	username: string;
	email: string;
	organisation: IOrganisationType;
	organisationDisplay: string;
	role: IRoleType;
	roleDisplay: string; // Serialized string of roles.
	restrictedOperators?: ITransModelRestrictionsObject[];
	restrictedLines?: TransModelLineViewModel[];
}

export interface RoleViewModel {
	// This class represents a single (readonly) row in the roles list
	id: string;
	name: string;
	scope: IRoleScope;
	prettyName: string;
}
