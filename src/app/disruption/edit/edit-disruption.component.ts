import { AfterContentChecked, AfterContentInit, Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroupHelper } from '../../shared/forms/FormGroupHelper';
import { IFormSubmittedState } from '../../shared/forms/FormStateEnum';
import { TabsService } from '../../shared/components/tabs/tabs.service';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import { EditDisruptionService } from './edit-disruption.service';
import { get, values } from 'lodash';
import * as moment from 'moment';
import { ITabsEnum } from './edit-disruption.tabs.enum';
import { ProfanityValidatorFn } from '../../shared/validators/profanity.validator';

@Component({
	selector: 'dm-edit-disruption',
	templateUrl: './edit-disruption.component.html',
	styleUrls: ['./edit-disruption.component.scss']
})
export class EditDisruptionComponent implements OnInit, AfterContentInit, AfterContentChecked, OnDestroy {
	private disruptionSavingSubscription: Subscription;
	private submitStateSubscription: Subscription;
	private errorsSubscription: Subscription;
	private formSubscription: Subscription;

	public disruptionForm: FormGroup;
	public currentTab = 'Overview';
	public formSubmittedState: IFormSubmittedState = IFormSubmittedState.Pending;
	public modified: string;
	public serverErrors: any;
	public pageTitle: string;
	public isTemplateMode: boolean;
	public draftValidationFailed = false;

	constructor(
		private formBuilder: FormBuilder,
		public editDisruptionService: EditDisruptionService,
		private tabsService: TabsService,
		private modalService: NgxSmartModalService,
		private location: Location,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.initNewForm();
		this.tabsService.init([ITabsEnum.Overview, ITabsEnum.Impacts, ITabsEnum.Messaging]);

		this.activatedRoute.url.subscribe(s => {
			this.isTemplateMode = s.findIndex(f => f.path === 'template') > 0;
		});
		this.disruptionSavingSubscription = this.editDisruptionService.currentDisruption$
			.subscribe(disruption => {
				this.serverErrors = null;
				if (!disruption) {
					this.disruptionForm.patchValue({
						id: '',
						submitComment: ''
					});
				} else {
					this.patchValues(disruption);
					this.isTemplateMode = disruption.isTemplate;

					if (disruption.decodedId) {
						this.location.replaceState('disruption/edit/' + disruption.decodedId);
					}
				}
		});

		this.submitStateSubscription = this.editDisruptionService.formSubmitStatus$.subscribe(val => {
			this.formSubmittedState = val;
			if (this.formSubmittedState === IFormSubmittedState.Saved) {
				this.modified = this.isTemplateMode ? 'Template' : 'Draft';
				this.modified = `${this.modified} saved at ${moment().format('HH:mm:ss')}`;
			} else {
				this.modified = '';
			}
			if (this.formSubmittedState === IFormSubmittedState.Submitted) {
				this.router.navigate(['disruptions']);
			}
		});

		this.errorsSubscription = this.editDisruptionService.errors$.subscribe(val => {
			this.serverErrors = val;
			this.modified = '';
		});

		this.formSubscription = this.disruptionForm.valueChanges.subscribe(() => {
			this.draftValidationFailed = false;
			this.formSubmittedState = IFormSubmittedState.Pending;
		});
	}

	ngAfterContentInit() {
		this.tabsService.tab$.subscribe(t => (this.currentTab = t));
	}

	ngAfterContentChecked() {
		this.setTitle();

		// Otherwise Angular complains about the dm-spinner show directive with
		// ExpressionChangedAfterBeingChecked error.
		this.changeDetectorRef.detectChanges();
	}

	ngOnDestroy() {
		if (this.disruptionSavingSubscription) {
			this.editDisruptionService.clearCurrentDisruption();
			this.disruptionSavingSubscription.unsubscribe();
		}

		if (this.submitStateSubscription) {
			this.submitStateSubscription.unsubscribe();
		}

		if (this.errorsSubscription) {
			this.errorsSubscription.unsubscribe();
		}

		if (this.formSubscription) {
			this.formSubscription.unsubscribe();
		}
	}

	private setTitle() {
		const mode = this.isTemplateMode ? 'template' : 'disruption';
		this.pageTitle = this.disruptionForm.get('id').value ? `Edit a ${mode}` : `Add a new ${mode}`;
	}

	private initNewForm() {
		this.disruptionForm = this.formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl('', ProfanityValidatorFn()),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});
	}

	private patchValues(viewModel: IEditDisruptionViewModel) {
		this.disruptionForm.patchValue({
			id: viewModel.id,
			submitComment: ''
		});
	}

	onSave() {
		if (this.formIsInvalidForDraft()) {
			this.editDisruptionService.setSubmittedStatus(IFormSubmittedState.Draft);
		} else {
			this.editDisruptionService.saveDisruption(this.disruptionForm, false, this.isTemplateMode);
		}
	}

	private formIsInvalidForDraft() {
		const overview = this.disruptionForm.get('overviewGroup') as FormGroup;
		const hasSummaryError = get(overview, 'errors.errors.summary');
		const hasFormatError =
			get(overview, 'errors.errors.link.pattern')
		const hasDescriptionError = get(overview, 'errors.errors.description.profanity') || 
			get(overview, 'errors.errors.description.nonAscii');
		const hasValidityPeriodError = get(overview, 'errors.errors.validityPeriods') ||
			get(overview, 'errors.errors.errors.openEndedMulti');
		const hasPublishingRangeError =
			get(overview, 'errors.errors.publishingRange') ||
			get(overview, 'errors.errors.validityPeriodBeforeStart') ||
			get(overview, 'errors.errors.validityPeriodAfterEnd');

		const messaging = this.disruptionForm.get('messagingGroup') as FormGroup;
		const profaneMessages = values(get(messaging, 'errors.messages')).filter(v => v.text && v.text.profanity)
			.length;
		this.draftValidationFailed =
			hasSummaryError || hasDescriptionError || hasFormatError || hasValidityPeriodError || hasPublishingRangeError || profaneMessages;
		return this.draftValidationFailed;
	}

	onSubmit() {
		this.editDisruptionService.setSubmittedStatus(IFormSubmittedState.Publish);
		if (this.disruptionForm.valid) {
			this.modal.open();
		} else {
			FormGroupHelper.getAllErrors(this.disruptionForm);
		}
	}

	submitModal() {
		if (this.disruptionForm.valid) {
			this.editDisruptionService.submitForPublication(this.disruptionForm);
			this.closeModal();
		}
	}

	closeModal() {
		FormGroupHelper.likeAVirgin(this.disruptionForm);
		this.modal.close();
	}

	onNavigate(idx: number) {
		const idxOfCurrent = this.tabsService.tabs.indexOf(this.currentTab);
		this.tabsService.setActive(this.tabsService.tabs[idxOfCurrent + idx]);
	}

	get modal() {
		return this.modalService.get('submit-modal');
	}

	get formSubmittedForDraftOrPublish() {
		return this.formSubmittedState !== IFormSubmittedState.Pending;
	}

	get formDraftSubmbitted() {
		return this.formSubmittedState !== IFormSubmittedState.Draft;
	}

	get formSubmittedForPublish() {
		return this.formSubmittedState === IFormSubmittedState.Publish;
	}

	get errorSubmittingDraft(): boolean {
		return this.formSubmittedState === IFormSubmittedState.Draft && this.draftValidationFailed;
	}

	get title(): string {
		return this.pageTitle;
	}

	get submitComment(): AbstractControl {
		return this.disruptionForm.get('submitComment');
	}

	public propInvalid(propName: string): boolean {
		const prop = this.disruptionForm.get(propName);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	public formErrors(group: string) {
		if (this.formSubmittedState === IFormSubmittedState.Publish) {
			let errors = [];
			if (this.disruptionForm.controls[group].errors) {
				if (group === 'messagingGroup') {
					const errs = this.disruptionForm.controls[group].errors;
					const errMessages = errs ? errs.messages : null;
					return (
						errMessages &&
						Object.keys(errMessages).reduce((total, e) => total + Object.keys(errMessages[e]).length, 0)
					);
				} else {
					errors = this.disruptionForm.controls[group].errors.errors;
					return errors && Object.keys(errors).length;
				}
			}
		}
		return 0;
	}
}
