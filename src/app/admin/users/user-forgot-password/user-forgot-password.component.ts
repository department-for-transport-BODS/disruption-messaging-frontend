import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';

@Component({
	selector: 'dm-user-forgot-password',
	templateUrl: './user-forgot-password.component.html',
	styleUrls: ['./user-forgot-password.component.scss']
})
export class UserForgotPasswordComponent implements OnInit, OnDestroy {
	forgotPasswordForm: FormGroup;

	formSubmitted = false;

	message = 'If the user exists within the system then a reset password email will have been sent';

	formSubscription: Subscription;

	constructor(
		private formBuilder: FormBuilder,
		public usersService: UsersService,
		private router: Router,
		private modalService: NgxSmartModalService
	) {
		this.forgotPasswordForm = formBuilder.group({
			email: [null, [Validators.email, Validators.required]]
		});
	}

	ngOnInit() {
		this.formSubscription = this.forgotPasswordForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.formReset();
			});
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.formSubmitted = true;
		if (this.forgotPasswordForm.valid) {
			this.usersService.resetPassword(this.forgotPasswordForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.forgotPasswordForm);
		}
	}

	hasError(key: string): boolean {
		const prop = this.forgotPasswordForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	onClose() {
		this.modalService.getModal('forgotPasswordModal').close();
		this.forgotPasswordForm.reset();
		this.formReset();
		this.router.navigate(['/login']);
	}

	private formReset() {
		this.usersService.errors = null;
		this.usersService.serverResponse = null;
		this.formSubmitted = false;
	}

	get email() {
		return this.forgotPasswordForm.get('email');
	}
}
