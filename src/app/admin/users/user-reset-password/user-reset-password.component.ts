import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { confirmPasswordMatchValidator } from '../user-signup/user-signup.component';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';

@Component({
	selector: 'dm-user-reset-password',
	templateUrl: './user-reset-password.component.html',
	styleUrls: ['./user-reset-password.component.scss']
})
export class UserResetPasswordComponent implements OnInit, OnDestroy {
	resetPasswordForm: FormGroup;

	formSubmitted = false;

	formSubscription: Subscription;

	routeSubscription: Subscription;

	constructor(
		private formBuilder: FormBuilder,
		public usersService: UsersService,
		private router: Router,
		private route: ActivatedRoute,
		private modalService: NgxSmartModalService
	) {
		this.resetPasswordForm = formBuilder.group(
			{
				password: [null, Validators.required],
				confirmPassword: [null, Validators.required],
				uid: [null, Validators.required],
				token: [null, Validators.required]
			},
			{ validators: confirmPasswordMatchValidator }
		);
	}

	ngOnInit() {
		this.formSubscription = this.resetPasswordForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.formReset();
			});
		this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
			this.uid.setValue(params.get('uid'));
			this.token.setValue(params.get('token'));
		});
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.formSubmitted = true;
		if (this.resetPasswordForm.valid) {
			this.usersService.resetPasswordConfirm(this.resetPasswordForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.resetPasswordForm);
		}
	}

	hasError(key: string): boolean {
		const prop = this.resetPasswordForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	onClose() {
		this.modalService.getModal('resetPasswordModal').close();
		this.resetPasswordForm.reset();
		this.formReset();
		this.router.navigate(['/login']);
	}

	private formReset() {
		this.usersService.errors = null;
		this.usersService.serverResponse = null;
		this.formSubmitted = false;
	}

	get password() {
		return this.resetPasswordForm.get('password');
	}

	get confirmPassword() {
		return this.resetPasswordForm.get('confirmPassword');
	}

	get uid() {
		return this.resetPasswordForm.get('uid');
	}

	get token() {
		return this.resetPasswordForm.get('token');
	}
}
