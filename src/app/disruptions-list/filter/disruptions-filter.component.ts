import { Component, OnInit, OnDestroy, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormBuilder, FormGroup } from '@angular/forms';
import { BaseControlValueAccessor } from '../../shared/forms/BaseControlValueAccessor';
import * as moment from 'moment';
import { ISeverityInput, IModeInput, IDisruptionStatusInput } from 'src/generated/graphql';
import { EnumFormatter, EnumTuple } from 'src/app/shared/formatters/enum.formatter';
import { DisruptionsFilter } from './disruptions-filter.class';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'dm-disruptions-filter',
	templateUrl: './disruptions-filter.component.html',
	styleUrls: ['./disruptions-filter.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DisruptionsFilterComponent),
			multi: true
		}
	]
})
export class DisruptionsFilterComponent extends BaseControlValueAccessor<DisruptionsFilter>
	implements OnInit, OnDestroy {
	filterGroup: FormGroup;
	// visibility
	showFilters = false;

	@Output()
	filtersChanged = new EventEmitter<DisruptionsFilter>();
	isTemplate = false;

	// Date range is handled by control: https://www.npmjs.com/package/ngx-daterangepicker-material
	readonly dateRangePickerOptions = {
		format: 'DD/MM/YYYY',
		separator: ' to ',
		applyLabel: 'OK',
		clearLabel: 'Clear',
		firstDay: 1 // Monday
	};

	readonly dateRangePresets = {
		Today: [moment(), moment()],
		Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		Tomorrow: [moment().add(1, 'days'), moment().add(1, 'days')],
		'Next week': [moment(), moment().add(6, 'days')],
		'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Last Month': [
			moment()
				.subtract(1, 'month')
				.startOf('month'),
			moment()
				.subtract(1, 'month')
				.endOf('month')
		],
		'Next Month': [
			moment()
				.add(1, 'month')
				.startOf('month'),
			moment()
				.add(1, 'month')
				.endOf('month')
		]
	};

	// drop down values
	filterModeCodes: EnumTuple[];
	filterStatusCodes: EnumTuple[];
	filterSeverityCodes: EnumTuple[];
	filterSubscription: Subscription;

	constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
		super();

		this.activatedRoute.url.subscribe(s => {
			this.isTemplate = s.findIndex(f => f.path === 'templates') > 0;
			this.filterGroup = this.formBuilder.group(this.getDefaultValues());
		});

		// values for dropdown lists
		this.filterModeCodes = EnumFormatter.toHumanisedDictionary(IModeInput);
		this.filterStatusCodes = EnumFormatter.toHumanisedDictionary(IDisruptionStatusInput);
		this.filterSeverityCodes = EnumFormatter.toHumanisedDictionary(ISeverityInput);
	}

	ngOnInit(): void {
		this.filterSubscription = this.filterGroup.valueChanges
			.pipe(
				debounceTime(500),
				distinctUntilChanged()
			)
			.subscribe(filters => {
				// Date ranges are handled outside of the form group, so merge the values.
				this.filtersChanged.emit(filters);
			});
	}

	ngOnDestroy(): void {
		this.filterSubscription.unsubscribe();
	}

	// Show / Hide filter controls
	toggleFilterVisibility() {
		this.showFilters = !this.showFilters;
	}

	getDefaultValues() {
		const defaultFilter = new DisruptionsFilter();
		defaultFilter.isTemplate = this.isTemplate;
		return defaultFilter;
	}

	get isTemplateView() {
		return this.isTemplate;
	}

	resetFilter() {
		this.filterGroup.reset(this.getDefaultValues(), { emitEvent: false, onlySelf: true });
	}

	// currently a pointless override :)
	writeValue(listFilter: DisruptionsFilter) {
		this.value = listFilter;
	}
}
