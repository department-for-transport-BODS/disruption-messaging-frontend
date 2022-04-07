import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import {
	NG_VALUE_ACCESSOR,
	NG_VALIDATORS,
	AbstractControl,
	ValidationErrors,
	FormGroup,
	FormBuilder,
	FormArray,
} from '@angular/forms';
import { IDisruptionTypeInput, IRepetitionInput } from 'src/generated/graphql';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { OverviewComponentForm } from './overview.component.form';
import { EnumFormatter, EnumTuple } from 'src/app/shared/formatters/enum.formatter';
import { Observable, Subject, concat, of, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, map } from 'rxjs/operators';
import { DisruptionAutocompleteModel } from './autocomplete-disruptions/disruption-autocomplete.model';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { IFormSubmittedState } from 'src/app/shared/forms/FormStateEnum';
import { EditDisruptionService } from '../edit-disruption.service';
import { DateRangeValidator } from './daterange.validator';
import { ActivatedRoute } from '@angular/router';
import { IEditDisruptionViewModel, IEditValidityPeriodViewModel } from '../edit-disruption.view.model';
import { AutocompleteDisruptionsService } from './autocomplete-disruptions/autocomplete-disruptions.service';
import * as moment from 'moment';
import { SettingsStore } from 'src/app/settings/settings.store';

@Component({
	selector: 'dm-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => OverviewComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => OverviewComponent),
			multi: true
		}
	]
})
export class OverviewComponent extends BaseControlValueAccessor<OverviewComponent> implements OnInit, OnDestroy {
	constructor(
		private formBuilder: FormBuilder,
		private editDisruptionService: EditDisruptionService,
		private autocompleteDisruptionsService: AutocompleteDisruptionsService,
		private route: ActivatedRoute,
		private settingsStore: SettingsStore
	) {
		super();
	}

	// subscriptions
	private subscriptions: Subscription[] = [];

	overview: FormGroup;
	submitStatus: IFormSubmittedState;

	// ref data
	reasons: EnumTuple[];
	disruptionTypes: EnumTuple[];
	repeatOptions: EnumTuple[];

	// autocomplete for related disruptions.
	allDisruptions$: Observable<DisruptionAutocompleteModel[]>;
	autocompleteLoading = false;
	autocompleteInput$ = new Subject<string>();

	control: AbstractControl;

	ngOnInit() {
		this.initReferenceData();
		this.initBlankForm();

		this.subscriptions.push(
			this.overview.valueChanges.subscribe(val => {
				this.value = val;
				this.onChange(val);
			})
		);

		this.subscriptions.push(
			this.editDisruptionService.formSubmitStatus$.subscribe(submitStatus => {
				this.submitStatus = submitStatus;
				if (submitStatus !== IFormSubmittedState.Pending) {
					this.overview.markAllAsTouched();
				}
			})
		);

		this.subscriptions.push(
			this.editDisruptionService.currentDisruption$.subscribe(disruption => {
				if (disruption) {
					this.updateFormValues(disruption);
				} else {
					this.validityPeriodsArr.clear();
					this.overview.reset();
					this.addValidityPeriod();
				}
			})
		);

		this.subscriptions.push(
			this.route.url.subscribe(url => {
				const id = parseInt(url.reverse()[0].path, 0);

				isNaN(id)
					? this.editDisruptionService.clearCurrentDisruption()
					: this.editDisruptionService.setCurrentDisruption(id);
			})
		);

		this.subscriptions.push(
			this.overview.get('isOpenEnded').valueChanges.subscribe(isOpenEnded => {
				this.validityPeriodsArr.controls.map(m => {
					if (isOpenEnded && m.get('repeats') === null) {
						m.get('endDate').disable();
					} else {
						m.get('endDate').enable();
					}

					m.setValidators(DateRangeValidator.validityPeriod(isOpenEnded));
					m.updateValueAndValidity();
				});

				const publishingEnd = this.overview.get('publishingEnd');
				isOpenEnded ? publishingEnd.disable() : publishingEnd.enable();
				this.overview.updateValueAndValidity();
			})
		);

		this.subscriptions.push(
			this.overview
				.get('validityPeriods')
				.valueChanges.pipe(distinctUntilChanged())
				.subscribe(s => {
					s.map((val, key) => {
						const period = this.validityPeriodsArr.at(key);
						let descriptionDate = '';
						let descriptionTime = '';
						if (this.isOpenEnded && period.get('repeats').value === null) {
							period.get('endDate').disable({ emitEvent: false });
						} else {
							period.get('endDate').enable({ emitEvent: false });
						}

						const startDate = period.get('startDate').value;
						const endDate = period.get('endDate').value;
						const ending = period.get('ending').value;

						if (endDate && ending) {
							if (period.get('repeats').value === 'Daily') {
								descriptionDate = DateFormatter.dateOnlyString(ending);
								descriptionTime = DateFormatter.timeWithoutSecondsString(endDate);
							} else if (period.get('repeats').value === 'Weekly') {
								const recurringDates = this.recurringDates(startDate, endDate, ending).pop();
								const lastStart = recurringDates[0];
								const lastEnd = recurringDates[1];

								if ((ending.isSame(lastEnd, 'day')) || (ending.isSame(lastStart, 'day'))) {
									descriptionDate = DateFormatter.dateOnlyString(ending);
									descriptionTime = DateFormatter.timeWithoutSecondsString(endDate);
								} else if (ending.isBetween(lastStart, lastEnd, 'day')) {
									descriptionDate = DateFormatter.dateOnlyString(ending);
									descriptionTime = DateFormatter.timeWithoutSecondsString(endDate.endOf('day'));
								} else if (ending.isAfter(lastEnd, 'day')) {
									descriptionDate = DateFormatter.dateOnlyString(lastEnd);
									descriptionTime = DateFormatter.timeWithoutSecondsString(lastEnd);
								}
							}
							period.get('description').setValue ('The validity period ends on ' + descriptionDate + ' at '
							+ descriptionTime, {emitEvent : false});
						}
					});
				})
		);

		this.descriptionValidator();
	}

	ngOnDestroy() {
		this.subscriptions.map(s => s.unsubscribe());
		this.editDisruptionService.description = null;
	}

	private descriptionValidator() {
		const description = this.overview.get('description');
		this.subscriptions.push(
			this.overview
				.get('description')
				.valueChanges.pipe(
					debounceTime(250),
					distinctUntilChanged()
				)
				.subscribe(lv => {
					this.editDisruptionService.description = description.value;
				})
		);
	}

	private initBlankForm(): void {
		this.overview = this.formBuilder.group(new OverviewComponentForm(this.formBuilder), {
			validator: [DateRangeValidator.publishingDates(), DateRangeValidator.disallowMultipleValidityPeriods()]
		});
		this.addValidityPeriod();
	}

	private updateFormValues(d: IEditDisruptionViewModel): void {
		const reason = EnumFormatter.toEnumString(d.reason);
		if (this.reasons.findIndex(r => r.value === reason) === -1) {
			this.reasons.push({ title: EnumFormatter.toPrettyString(reason), value: reason } as EnumTuple);
		}

		this.overview.patchValue({
			summary: d.summary,
			description: d.description,
			link: d.link,
			disruptionType: d.disruptionType,
			reason,
			related: d.related,
			publishingStart: d.publishingStart,
			publishingEnd: d.publishingEnd,
			isOpenEnded: d.isOpenEnded
		});

		if (d.validityPeriods && d.validityPeriods.length) {
			this.validityPeriodsArr.clear();
			d.validityPeriods.map(vp => {
				this.addValidityPeriod(vp);
			});

			if (d.isOpenEnded) {
				this.validityPeriodsArr.controls
					.filter(f => f.get('repeats').value === null)
					.map(m => {
						m.get('endDate').disable();
					});
			}
		}
	}

	private recurringDates(startDate, endDate, ending, interval = 7) {
		const recurrent = [];

		while (startDate.isSameOrBefore(ending, 'day')) {
			const startEndArr = [];
			startEndArr.push(startDate, endDate);
			recurrent.push(startEndArr);
			endDate = moment(endDate).add(7, 'days');
			startDate = moment(startDate).add(7, 'days');
		}
		return recurrent;
	}

	private initReferenceData(): void {
		this.subscriptions.push(this.settingsStore.reasonsList$().subscribe(s => {
			this.reasons = s;
		}));
		this.disruptionTypes = EnumFormatter.toHumanisedDictionary(IDisruptionTypeInput);
		const blankOption: EnumTuple = { title: 'Doesn\'t Repeat', value: null };
		this.repeatOptions = EnumFormatter.toHumanisedDictionary(IRepetitionInput).concat([blankOption]);
		this.autoCompleteSuggestions();
	}

	get description() {
		return this.overview.get('description');
	}

	get summary() {
		return this.overview.get('summary');
	}

	get link() {
		return this.overview.get('link');
	}

	get reason() {
		return this.overview.get('reason');
	}

	get isOpenEnded() {
		return this.overview.get('isOpenEnded').value;
	}

	get validityPeriodsArr() {
		return this.overview.get('validityPeriods') as FormArray;
	}

	get related() {
		return this.overview.get('related');
	}

	get pending(): boolean {
		return this.submitStatus === IFormSubmittedState.Pending;
	}

	get submittedForPublish(): boolean {
		return this.submitStatus === IFormSubmittedState.Publish;
	}

	startStartDateAt(idx: number): moment.Moment {
		const date = this.findValidityPeriodProperty(idx, 'startDate');
		if (date !== null) {
			return date;
		}
		return this.startOfToday();
	}

	startEndDateAt(idx: number): moment.Moment {
		const date = this.findValidityPeriodProperty(idx, 'endDate');
		if (date !== null) {
			return date;
		}

		return this.endOfToday();
	}

	startEndingAt(idx: number) {
		const date = this.findValidityPeriodProperty(idx, 'ending');
		if (date !== null) {
			return date;
		}
		return this.endOfToday();
	}

	private findValidityPeriodProperty(idx: number, prop: string): moment.Moment {
		if (idx !== undefined) {
			const vp = this.validityPeriodsArr.at(idx) as FormGroup;
			if (vp !== null) {
				return vp.get(prop).value;
			}
		}
		return null;
	}

	private endOfToday(): moment.Moment {
		return moment()
			.endOf('date');
	}

	private startOfToday(): moment.Moment {
		return moment()
			.startOf('date');
	}

	startPublishStartAt() {
		const ps = this.overview.get('publishingStart');
		if (ps !== null && ps.value !== null) {
			return ps.value;
		}

		return this.startOfToday();
	}

	startPublishEndAt() {
		const ps = this.overview.get('publishingEnd');
		if (ps !== null && ps.value !== null) {
			return ps.value;
		}

		return this.endOfToday();
	}

	public addValidityPeriod(vm: IEditValidityPeriodViewModel = {}): void {
		this.validityPeriodsArr.push(
			this.formBuilder.group(
				{
					id: [vm.id],
					startDate: [vm.startDate],
					endDate: [vm.endDate],
					repeats: [vm.repeats],
					ending: [vm.ending],
					description: [vm.description],
				},
				{ validators: DateRangeValidator.validityPeriod(this.isOpenEnded) }
			)
		);
	}

	public remove(idx: number): void {
		this.validityPeriodsArr.removeAt(idx);
	}

	public getError(idx: number, key: string): boolean {
		return this.validityPeriodsArr.at(idx).errors && this.validityPeriodsArr.at(idx).errors[key];
	}

	public formError(key: string): boolean {
		return this.overview.errors && this.overview.errors[key];
	}

	public hasErrors(idx: number): boolean {
		return !!(this.validityPeriodsArr.at(idx).errors);
	}

	public propInvalid(propName: string): boolean {
		const prop = this.overview.get(propName);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	validate(c: AbstractControl): ValidationErrors | null {
		this.control = c;
		let errors: { [key: string]: any } = {};

		if (!this.overview.valid) {
			errors = FormGroupHelper.getAllErrors(this.overview) || {};
		}

		if (!this.overview.controls.validityPeriods.valid) {
			errors.validityPeriods = FormGroupHelper.getAllErrors(this.overview.controls.validityPeriods as FormArray);
		}

		return Object.keys(errors).length ? { errors } : null;
	}

	public trackByFn(item: { title: ''; id: '' }) {
		return item.id;
	}

	private autoCompleteSuggestions() {
		this.allDisruptions$ = concat(
			of([]), // default items
			this.autocompleteInput$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.autocompleteLoading = true)),
				switchMap(term =>
					this.autocompleteDisruptionsService.autocomplete(term).pipe(
						map( disruptions => disruptions.filter( disruption => disruption.id !== this.editDisruptionService.id)),
						catchError(() => of([])), // empty list on error
						tap(() => (this.autocompleteLoading = false))
					)
				)
			)
		);
	}
}
