import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { OrganisationViewModel } from '../../organisation/organisation.viewmodel';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { OrganisationService } from '../../organisation/organisation.service';
import { FormGroupHelper } from '../../../shared/forms/FormGroupHelper';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { MailingListService } from '../mailing-list.service';
import { SettingsStore } from '../../../settings/settings.store';
import { EnumTuple } from '../../../shared/formatters/enum.formatter';
import { UserStoreService } from '../../../user/user.store.service';
import { EmailValidator } from '../../../shared/validators/email.validator';

export interface UserOrg {
	id: string;
	name: string;
}

@Component({
	selector: 'dm-mailing-list-edit',
	templateUrl: './mailing-list-edit.component.html',
	styleUrls: ['./mailing-list-edit.component.scss']
})
export class MailingListEditComponent implements OnInit, OnChanges, OnDestroy {

	mlEntry: MailingListViewmodel;

	mlForm: FormGroup;

	subscription: Subscription;

	formSubmitted = false;

	formSubscription: Subscription;

	orgSubscription: Subscription;

	userSubscription: Subscription;

	allOrgs: OrganisationViewModel[] = [];

	modalTitle = 'Add a new mailing list entry';

	severityList$: Observable<EnumTuple[]>;

	orgList$: Observable<OrganisationViewModel[]>;

	userOrg: UserOrg = null;

	constructor(
		private formBuilder: FormBuilder,
		public service: MailingListService,
		private settingsStore: SettingsStore,
		private orgService: OrganisationService,
		private userStore: UserStoreService,
	) {
		this.mlForm = this.formBuilder.group({
			id: new FormControl(''),
			email: [null, [Validators.required, EmailValidator.validate()]],
			severity: [[], [Validators.required]],
			organisation: [null, [Validators.required]]
		});
	}

	ngOnInit() {
		this.subscription = this.service.selectForEdit$().subscribe(mlEntry => {
			this.updateFormValues(mlEntry);
		});
		this.severityList$ = this.settingsStore.severityList$();
		this.orgList$ = this.orgService.list();

		this.userSubscription = this.userStore.user$.subscribe(user => {
			if (user && user.organisation) {
				this.userOrg = user.organisation;
				this.organisation.setValue(user.organisation);
			}
		});
		this.orgSubscription = this.orgList$.subscribe(response => {
			this.allOrgs = response;
		});
		this.onFormChanges();
	}

	ngOnChanges(): void {
		this.updateFormValues();
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.formSubscription.unsubscribe();
		this.orgSubscription.unsubscribe();
		this.userSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.formSubmitted = true;
		if (this.mlForm.valid) {
			this.service.save(this.mlForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.mlForm);
		}
	}

	private onFormChanges() {
		this.formSubscription = this.mlForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.service.resetSubjects();
				this.formSubmitted = false;
			});
	}

	private updateFormValues(entry?: MailingListViewmodel): void {
		this.mlEntry = entry;
		if (entry) {
			this.mlForm.patchValue({
				id: entry.id,
				email: entry.email,
				severity: entry.severityList,
				organisation: entry.organisation
			});
			this.modalTitle = 'Edit mailing list entry';
		} else {
			this.mlForm.reset();
			this.organisation.setValue(this.userOrg);
			this.modalTitle = 'Add a new mailing list entry';
		}
	}

	hasError(key: string): boolean {
		const prop = this.mlForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	get email() {
		return this.mlForm.get('email');
	}

	get severity() {
		return this.mlForm.get('severity');
	}

	get organisation() {
		return this.mlForm.get('organisation');
	}

	mapError(error) {
		if (error.search(/Key \(email, organisation_id\)=.*?already exists/) !== -1) {
			return 'Mailing list entry with this email already exists.';
		}
		return error;
	}
}
