import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { UserStoreService } from '../user/user.store.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'dm-authentication',
	templateUrl: './authentication.component.html',
	styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {
	loginFailed: string;
	username = '';
	password = '';

	constructor(
		private auth: AuthenticationService,
		private userService: UserStoreService,
		private router: Router,
		private spinner: NgxSpinnerService) {}

	ngOnInit(): void {
		if (this.userService.isAuthenticated) {
			this.router.navigate(['dashboard']);
		}
		this.auth.loginFailure$.subscribe(res => (this.loginFailed = res));
		this.auth.loginProgress$.subscribe(loading => loading ? this.spinner.show() : this.spinner.hide());
	}

	submit(): void {
		if (this.valid) {
			this.auth.login(this.username, this.password);
		} else {
			this.loginFailed = 'Please enter username and password';
		}
	}

	get valid(): boolean {
		return Boolean(this.username && this.password);
	}

	forgotPassword(event) {
		event.preventDefault();
		this.router.navigate(['/forgot-password']);
	}
}
