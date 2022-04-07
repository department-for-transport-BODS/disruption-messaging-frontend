import { Component, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IAdminAreaType } from '../../../../generated/graphql';
import { OrganisationService } from '../organisation.service';
import { AdminAreasService } from '../admin_areas.service';
import { OrganisationViewModel } from '../organisation.viewmodel';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { LinkValidator } from '../../../shared/validators/link.validator';

@Component({
	selector: 'dm-org-edit',
	templateUrl: './org-edit.component.html',
	styleUrls: ['./org-edit.component.scss']
})
export class OrgEditComponent implements OnInit, OnChanges, OnDestroy {
	organisation: OrganisationViewModel;

	organisationForm: FormGroup;

	organisationSubscription: Subscription;

	allAdminAreas$: Observable<IAdminAreaType[]>;

	formSubmitted = false;

	formSubscription: Subscription;

	modalTitle = 'Add a new organisation';

	constructor(
		private formBuilder: FormBuilder,
		public orgService: OrganisationService,
		private adminAreasService: AdminAreasService
	) {
		this.organisationForm = this.formBuilder.group({
			id: new FormControl(''),
			name: [null, [Validators.required, Validators.maxLength(250)]],
			url: [null, LinkValidator.validate()],
			adminAreas: []
		});
	}

	ngOnInit() {
		this.organisationSubscription = this.orgService.selectedOrganisation$.subscribe(organisation => {
			this.updateFormValues(organisation);
		});
		this.allAdminAreas$ = this.adminAreasService.list();
		this.onFormChanges();
	}

	ngOnChanges(): void {
		this.updateFormValues();
	}

	ngOnDestroy(): void {
		this.organisationSubscription.unsubscribe();
		this.formSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.formSubmitted = true;
		if (this.organisationForm.valid) {
			this.orgService.save(this.organisationForm);
		} else {
			FormGroupHelper.whenIthinkAboutYou(this.organisationForm);
		}
	}

	private onFormChanges() {
		this.formSubscription = this.organisationForm.valueChanges
			.pipe(
				debounceTime(200),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.orgService.resetSubjects();
				this.formSubmitted = false;
			});
	}

	private updateFormValues(organisation?: OrganisationViewModel): void {
		this.organisation = organisation;
		if (organisation) {
			this.organisationForm.patchValue({
				id: organisation.id,
				name: organisation.name,
				url: organisation.url,
				adminAreas: organisation.adminAreas
			});
			this.modalTitle = 'Edit organisation details';
		} else {
			this.organisationForm.reset();
			this.modalTitle = 'Add a new organisation';
		}
	}

	hasError(key: string): boolean {
		const prop = this.organisationForm.get(key);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	get url() {
		return this.organisationForm.get('url');
	}

	get name() {
		return this.organisationForm.get('name');
	}

	get adminAreas() {
		return this.organisationForm.get('adminAreas');
	}
}
