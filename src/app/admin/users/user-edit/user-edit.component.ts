import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { RoleViewModel, UserViewModel } from '../user.viewmodel';
import { UsersService } from '../users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserMapper } from '../user.mapper';
import { OrganisationViewModel } from '../../organisation/organisation.viewmodel';
import { OrganisationService } from '../../organisation/organisation.service';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { ITransModelOperatorType, ITransModelLineType, IUserType } from 'src/generated/graphql';
import { IRoleScope } from '../../../../generated/enum-overrides';
import { TransModelService } from 'src/app/shared/components/transport-data/transmodel.service';
import { OperatorsListService } from 'src/app/shared/components/autocomplete-operators/operators-list.service';
import { UserStoreService } from '../../../user/user.store.service';

@Component({
	selector: 'dm-user-edit',
	templateUrl: './user-edit.component.html',
	styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy, OnChanges {
	user: UserViewModel;
	modalTitle: string;
	userForm: FormGroup;
	formSubmitted = false;
	showRestrictions = false;

	formSubscription: Subscription;
	selectedUser: Subscription;
	currentUserSubscription: Subscription;
	organisationValueSubscription: Subscription;
	currentUser: IUserType;

	allOrgs$: Observable<OrganisationViewModel[]>;
	allRoles$: Observable<RoleViewModel[]>;
	allOperators$: Observable<ITransModelOperatorType[]>;
	allLines$: Observable<ITransModelLineType[]>;

	@Input()
	myProfile: boolean;

	constructor(
		private formBuilder: FormBuilder,
		public usersService: UsersService,
		private orgService: OrganisationService,
		private opListService: OperatorsListService,
		private lineListService: TransModelService,
		private userStoreService: UserStoreService,
	) {
		this.userForm = this.formBuilder.group({
			id: new FormControl(''),
			username: [],
			email: [null, [Validators.email, Validators.required]],
			organisation: [],
			role: [null, Validators.required],
			restrictedOperators: [],
			restrictedLines: []
		});
	}

	ngOnInit() {
		// This subscription must be set up before this.updateFormValues is called because
		// this triggers the form to be updated and needs this.currentUser to be defined.
		// Filter out null values which happens a lot during testing
		this.currentUserSubscription = this.userStoreService.user$
			.pipe(filter(user => Boolean(user)))
			.subscribe((user) => {
				if (!this.currentUser) {
					// dont bother assigning currentUser if its already defined
					this.currentUser = user;
			}
		});
		this.selectedUser = this.usersService.selectedUser$.subscribe(user => this.updateFormValues(user));
		// Strangely async pipe doesn't work properly when allRoles is called directly in the template
		// the requests keep getting sent.
		this.allRoles$ = this.usersService.allRoles();
		this.allOrgs$ = this.orgService.list();
		this.allLines$ = this.lineListService.allLines();
		this.allOperators$ = this.opListService.listOperators();


		this.onFormChanges();
	}

	ngOnChanges(): void {
		this.updateFormValues();
	}

	ngOnDestroy(): void {
		this.selectedUser.unsubscribe();
		this.formSubscription.unsubscribe();
		this.currentUserSubscription.unsubscribe();
		this.organisationValueSubscription.unsubscribe();
	}

	onSubmit(): void {
		if (this.userForm.valid) {
			this.formSubmitted = true;
			this.email.setValue((this.email.value as string).toLocaleLowerCase());
			this.usersService.save(this.userForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.userForm);
		}
	}

	private onFormChanges() {
		this.formSubscription = this.userForm.valueChanges
			.pipe((debounceTime(200), distinctUntilChanged()))
			.subscribe(() => {
				this.usersService.errors = null;
				this.usersService.serverResponse = null;
				this.formSubmitted = false;
			});
		this.organisationValueSubscription = this.role.valueChanges.subscribe( value => {
			if (this.currentUser.organisation && value) {
				// Only pre-fill organisation if the user isnt a system admin
				// and if the role has been filled in the form
				if (IRoleScope[value.scope] === IRoleScope.ORG && this.userStoreService.isOrganisationScope()) {
					this.userForm.patchValue({
						organisation: this.currentUser.organisation
					});
				}
			}
		});
	}

	private updateFormValues(user?: UserViewModel): void {
		this.user = user;
		if (user) {
			// We are in edit user mode
			this.username.disable();
			this.userForm.patchValue({
				id: user.id,
				username: user.username,
				email: user.email,
				organisation: user.organisation,
				role: user.role && UserMapper.getRoleModel(user.role),
				restrictedLines: user.restrictedLines,
				restrictedOperators: user.restrictedOperators
			});
			this.modalTitle = this.myProfile ? 'My profile' : 'Edit user details';
			this.showRestrictions = true;
		} else {
			// Creating a new user
			this.username.setValidators(null);
			// why are we resetting here?
			this.userForm.reset();
			this.modalTitle = 'Invite a new user';
			this.showRestrictions = false;
		}
	}

	hasError(key: string): boolean {
		const prop = this.userForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	get username() {
		return this.userForm.get('username');
	}

	get email() {
		return this.userForm.get('email');
	}

	get organisation() {
		return this.userForm.get('organisation');
	}

	get role() {
		return this.userForm.get('role');
	}
}
