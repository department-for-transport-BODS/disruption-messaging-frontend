import { ISocialRegistrationAccountType } from '../../generated/enum-overrides';
import { IHootSuiteProfileType } from 'src/generated/graphql';

export interface ISocialAccountViewModel {
	id?: string;
	username: string;
	organisation: string;
	createdBy: string;
	prettyName: string;
	email: string;
	name: string;
	accountType: ISocialRegistrationAccountType;
	pages?: string;
	displayName?: string;
	expiresIn?: string;
	isHootSuite: boolean;
	hootSuiteProfiles: IHootSuiteProfileType[];
}
