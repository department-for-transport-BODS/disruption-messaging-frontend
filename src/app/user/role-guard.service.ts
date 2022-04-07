import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserStoreService } from './user.store.service';

@Injectable()
export class RoleGuardService implements CanActivate {
	constructor(public userStore: UserStoreService, public router: Router) {}

	canActivate(): boolean {
		const isAuthorised = this.userStore.isAuthorisedForSettings();
		if (!isAuthorised) {
			this.router.navigate(['/not-found']);
			return false;
		}
		return true;
	}
}
