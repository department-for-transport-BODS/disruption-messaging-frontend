import { Injectable } from '@angular/core';
import { ISocialAccountType, ISocialAccountAccountType } from '../../generated/graphql';
import { ISocialAccountViewModel } from './social.view.model';
import { ISocialRegistrationAccountType } from '../../generated/enum-overrides';
import * as moment from 'moment';
import { ViewModelMapper } from '../shared/types/viewmodel-mapper';

@Injectable({
	providedIn: 'root'
})
export class SocialAccountViewModelMapper implements ViewModelMapper<ISocialAccountType, ISocialAccountViewModel> {
	getModel(apiResponse: ISocialAccountType): ISocialAccountViewModel | null {
		if (!apiResponse) {
			return null;
		}
		const vm: ISocialAccountViewModel = {
			id: apiResponse.id,
			createdBy: apiResponse.createdBy.username,
			organisation: apiResponse.createdBy.organisation ? apiResponse.createdBy.organisation.name : null,
			prettyName: apiResponse.prettyName,
			username: apiResponse.username,
			email: apiResponse.email,
			name: apiResponse.email || apiResponse.username,
			accountType: ISocialRegistrationAccountType[apiResponse.accountType],
			hootSuiteProfiles: apiResponse.hootsuiteProfiles,
			isHootSuite: apiResponse.accountType === 'A_3' ? true : false,
			expiresIn: this.resolveTokenExpiresAt(apiResponse)
		};

		switch (apiResponse.accountType) {
			case ISocialAccountAccountType.A_1:  // Twitter
				vm.displayName = apiResponse.prettyName;
				break;
			case  ISocialAccountAccountType.A_2:  // Facebook
				vm.pages =
					apiResponse.facebookPages && apiResponse.facebookPages.length > 0
						? apiResponse.facebookPages.map(m => m.name).join(',')
						: 'None';
				vm.displayName = vm.pages;
				break;
			case ISocialAccountAccountType.A_3:  // HootSuite
				vm.displayName = apiResponse.email;
				break;
			default:
				vm.displayName = apiResponse.prettyName;
		}
		return vm;
	}

	resolveTokenExpiresAt(apiResponse: ISocialAccountType): string {
		if (!apiResponse.tokenExpiresAt || apiResponse.accountType === 'A_3') {
			/*
			A_3 is hootsuite; its API's token only lasts an hour and the backend hootsuite
			code automatically refreshes the token when it expires. The user wont have to do
			anything so returning 'Never'
			Note that its epoch time not number of milliseconds
			*/
			return 'Never';
		}
		return moment().add(apiResponse.tokenExpiresAt, 'milliseconds').fromNow();
	}
}
