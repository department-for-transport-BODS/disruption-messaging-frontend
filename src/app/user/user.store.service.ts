import { Injectable } from '@angular/core';
import { IRoleType, IUserGQL, IUserType } from 'src/generated/graphql';
import { IRoleScope } from 'src/generated/enum-overrides';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';

@Injectable({
	providedIn: 'root'
})
export class UserStoreService {
	private userSubject = new BehaviorSubject<IUserType>(null);

	constructor(private userGQL: IUserGQL, private apollo: Apollo) {}

	get user$() {
		return this.userSubject.asObservable();
	}

	setAuthenticated(user: IUserType) {
		this.userSubject.next(user);
	}

	login(): void {
		this.userGQL
			.watch()
			.valueChanges.pipe(map(result => result.data ? result.data.user as IUserType : null))
			.subscribe(
				user => {
					this.userSubject.next(user);
				},
				error => {
					console.log('error getting user details: ' + error); // TODO log errors??!
				}
			);
	}

	logout(): void {
		this.userSubject.next(null);
		this.apollo.getClient().resetStore();
	}

	isAuthenticated() {
		return this.userSubject.getValue() !== null;
	}

	isAuthorisedForSettings() {
		const user = this.userSubject.getValue();
		if (user !== null) {
			return user.capabilities && user.capabilities.enumOverrides;
		}
	}

	isOrganisationScope(): boolean {
		// returns true only if the all roles are organisation scoped
		const user = this.userSubject.getValue();
		if (user.roles.length === 0) {
			// Probably dealing with a system admin
			return false;
		}
		return user.roles.every((role: IRoleType) => IRoleScope[role.scope] === IRoleScope.ORG);
	}
}
