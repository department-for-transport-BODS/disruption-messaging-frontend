import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserStoreService } from '../../../user/user.store.service';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { confirmPasswordMatchValidator } from '../user-signup/user-signup.component';

@Component({
	selector: 'dm-user-password',
	templateUrl: './user-password.component.html',
	styleUrls: ['./user-password.component.scss']
})
export class UserPasswordComponent implements OnInit, OnDestroy {
	passwordForm: FormGroup;

	formSubmitted = false;

	formSubscription: Subscription;

	userStoreSubscription: Subscription;

	redirectUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		public usersService: UsersService,
		private route: ActivatedRoute,
		private router: Router,
		private userStoreService: UserStoreService,
		private modalService: NgxSmartModalService
	) {}

	ngOnInit() {
		this.passwordForm = this.formBuilder.group(
			{
				currentPassword: [null, Validators.required],
				password: [null, Validators.required],
				confirmPassword: [null, Validators.required],
				username: []
			},
			{ validators: confirmPasswordMatchValidator }
		);
		this.formSubscription = this.passwordForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.usersService.errors = null;
				this.usersService.serverResponse = null;
				this.formSubmitted = false;
			});
		this.userStoreSubscription = this.userStoreService.user$.subscribe(user => {
			if (user) {
				this.username.setValue(user.username);
			}
		});
		this.redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
	}

	ngOnDestroy(): void {
		this.formSubscription.unsubscribe();
		this.userStoreSubscription.unsubscribe();
	}

	onClose() {
		this.modalClose();
		this.passwordForm.reset();
		this.router.navigate([this.redirectUrl]);
	}

	private modalClose() {
		this.modalService.getModal('passwordModal').close();
	}

	hasError(key: string): boolean {
		const prop = this.passwordForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	onSubmit() {
		this.formSubmitted = true;
		if (this.passwordForm.valid) {
			this.usersService.changePassword(this.passwordForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.passwordForm);
		}
	}

	get password() {
		return this.passwordForm.get('password');
	}

	get confirmPassword() {
		return this.passwordForm.get('confirmPassword');
	}

	get currentPassword() {
		return this.passwordForm.get('currentPassword');
	}

	get username() {
		return this.passwordForm.get('username');
	}
}
