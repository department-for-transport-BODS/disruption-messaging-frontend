import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserStoreService } from './user.store.service';

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(public userStore: UserStoreService, public router: Router) {}

	canActivate(): boolean {
		const isAuthenticated = this.userStore.isAuthenticated();
		if (isAuthenticated) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}
