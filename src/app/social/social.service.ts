import { Injectable } from '@angular/core';
import {
	IAllSocialAccountsGQL,
	ISocialAccountType,
	IRegisterSocialAccountGQL,
	ISocialRegistrationInput,
	ISocialAccountEnum,
	IDeleteSocialAccountGQL,
	ISocialAccountAccountType,
	ISocialRegistrationType
} from '../../generated/graphql';
import { Observable, BehaviorSubject } from 'rxjs';
import { ISocialAccountViewModel } from './social.view.model';
import { SocialAccountViewModelMapper } from './social.view-model.mapper';
import { ApiService } from '../shared/services/api.service';
import { map } from 'rxjs/operators';
import { ISocialRegistrationAccountType } from 'src/generated/enum-overrides';

@Injectable({
	providedIn: 'root'
})
export class SocialService extends
		ApiService<ISocialAccountType, ISocialAccountViewModel, ISocialRegistrationInput> {
	constructor(
		private allSocialAccounts: IAllSocialAccountsGQL,
		private registerAccountGQL: IRegisterSocialAccountGQL,
		private deleteAccountGQL: IDeleteSocialAccountGQL,
		private sMapper: SocialAccountViewModelMapper
	) {
		super(allSocialAccounts, null, null, deleteAccountGQL, sMapper);
	}

	get authorizedUrl$() {
		return this.authorizedUrlSubject.asObservable();
	}

	private authorizedUrlSubject = new BehaviorSubject<string>(null);

	get deleteSuccess$() {
		return this.deleteSucessSubject.asObservable();
	}

	private deleteSucessSubject = new BehaviorSubject<boolean>(null);

	socialAccounts$(): Observable<ISocialAccountViewModel[]> {
		return this.list();
	}

	registerAccount(accountType: ISocialAccountEnum) {
		const input: ISocialRegistrationInput = {
			accountType
		};
		this.registerAccountGQL
			.mutate({
				params: input
			}, {refetchQueries: [{query: this.allSocialAccounts.document}]})
			.subscribe(
				result => {
					const resp = result.data.registerSocialAccount;
					if (resp.errors) {
						this.errors = resp.errors;
					} else {
						this.authorizedUrlSubject.next(resp.data.authorizeUrl);
					}
				},
				({ networkError }) => (this.errors = networkError)
			);
	}

	deleteAccount(id: string) {
		this.delete(id);
	}
}
