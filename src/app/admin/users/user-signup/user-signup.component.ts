import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { IInvitationsType } from 'src/generated/graphql';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { LeadingSpaceValidator } from 'src/app/shared/validators/leadingspace.validator';

export function confirmPasswordMatchValidator(control: FormGroup): ValidationErrors | null {
	const password = control.get('password');
	const confirmPassword = control.get('confirmPassword');
	return password && confirmPassword && password.value !== confirmPassword.value
		? { confirmPasswordMisMatch: true }
		: null;
}

@Component({
	selector: 'dm-user-signup',
	templateUrl: './user-signup.component.html',
	styleUrls: ['./user-signup.component.scss']
})
export class UserSignupComponent implements OnInit, OnDestroy {
	signUpForm: FormGroup;

	formSubmitted = false;

	routeSubscription: Subscription;

	formSubscription: Subscription;

	invitation$: Observable<IInvitationsType> = null;

	constructor(
		private formBuilder: FormBuilder,
		private usersService: UsersService,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService
	) {}

	ngOnInit() {
		this.signUpForm = this.formBuilder.group(
			{
				key: [],
				username: [null, [Validators.required, LeadingSpaceValidator.validate]],
				password: [null, Validators.required],
				confirmPassword: [null, Validators.required],
				firstName: [],
				lastName: []
			},
			{ validators: confirmPasswordMatchValidator }
		);
		this.routeSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
			this.key.setValue(params.get('key'));
			this.invitation$ = this.usersService.invitation(params.get('key'));
		});
		this.formSubscription = this.signUpForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.usersService.errors = null;
				this.usersService.serverResponse = null;
				this.formSubmitted = false;
			});
	}

	ngOnDestroy(): void {
		this.routeSubscription.unsubscribe();
		this.formSubscription.unsubscribe();
	}

	private onClose() {
		this.modalClose();
		this.signUpForm.reset();
		this.router.navigate(['/login']);
	}

	private modalClose() {
		this.modalService.getModal('signUpModal').close();
	}

	onSubmit() {
		this.formSubmitted = true;
		if (this.key && this.signUpForm.valid) {
			this.usersService.signUp(this.signUpForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.signUpForm);
		}
	}

	hasError(key: string): boolean {
		const prop = this.signUpForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	get username() {
		return this.signUpForm.get('username');
	}

	get password() {
		return this.signUpForm.get('password');
	}

	get confirmPassword() {
		return this.signUpForm.get('confirmPassword');
	}

	get key() {
		return this.signUpForm.get('key');
	}
}
