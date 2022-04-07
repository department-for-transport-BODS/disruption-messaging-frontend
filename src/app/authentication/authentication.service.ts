import {Injectable, ɵConsole} from '@angular/core';
import {ILoginGQL, ILogoutGQL} from 'src/generated/graphql';
import {BehaviorSubject} from 'rxjs';
import {UserStoreService} from '../user/user.store.service';
import {Router} from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {
	private loginFailureSubject = new BehaviorSubject<string>('');
	private loginProgressSubject = new BehaviorSubject<boolean>(false);

	constructor(
		private loginGQL: ILoginGQL,
		private logoutGQL: ILogoutGQL,
		private userStore: UserStoreService,
		private router: Router) {
	}

	get loginFailure$() {
		return this.loginFailureSubject.asObservable();
	}

	get loginProgress$() {
		return this.loginProgressSubject.asObservable();
	}

	login(username: string, password: string): void {
		this.loginProgressSubject.next(true);
		this.loginGQL.mutate({username, password}).subscribe(({data}) => {
			if (data.login.success && data.login.errors === null) {
				this.userStore.login();
				this.userStore.user$.subscribe(user => user && this.loginProgressSubject.next(false));
			} else {
				this.loginProgressSubject.next(false);
				this.loginFailureSubject.next(data.login.errors);
			}
		});
	}

	logout(): void {
		this.logoutGQL.mutate().subscribe(
			({data}) => {
				if (data.logout.success && data.logout.errors == null) {
					this.userStore.logout();
					this.loginFailureSubject.next(null);
					this.router.navigate(['/login']);
				}
			},
			error => {
				console.log(error); // TODO - error log
			}
		);
	}
}
