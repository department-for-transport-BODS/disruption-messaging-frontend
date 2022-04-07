import {
	AfterContentChecked,
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	forwardRef,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	ViewChild,
	ViewChildren
} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	FormBuilder,
	FormGroup,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ValidationErrors
} from '@angular/forms';
import { ImpactComponentForm } from './impact-component-form';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import { IModeInput, IModeTypeEnum, ITransModelOperatorType } from 'src/generated/graphql';
import { EnumFormatter, EnumTuple } from 'src/app/shared/formatters/enum.formatter';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { concat, forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { ImpactTypeValidator } from './impactType.validator';
import * as l from 'lodash';
import { differenceBy } from 'lodash';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { IImpactType } from 'src/app/shared/impact.type.enum';
import { TransModelService } from '../../../shared/components/transport-data/transmodel.service';
import {
	TransModelLineViewModel,
	TransModelStopsViewModel
} from '../../../shared/components/transport-data/transmodel.view.model';
import { ImpactMapService } from '../impact-map/impact-map.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { values, flatten, has, sortBy, clone } from 'lodash';
import { TransModelLineViewMapper } from '../../../shared/components/transport-data/transmodel.view.mapper';
import { SettingsStore } from 'src/app/settings/settings.store';

const ALL_DIRECTIONS = 'All directions';

@Component({
	selector: 'dm-impact',
	templateUrl: './impact.component.html',
	styleUrls: ['./impact.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ImpactComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => ImpactComponent),
			multi: true
		},
		ImpactMapService
	]
})
export class ImpactComponent extends BaseControlValueAccessor<ImpactComponentForm>
	implements ControlValueAccessor, OnInit, OnDestroy, AfterContentChecked, AfterViewInit {
	private subscriptions: Subscription[] = [];
	public impactGroup: FormGroup;

	public allModes: EnumTuple[];
	public severities: EnumTuple[];
	public directions: EnumTuple[];
	public impactTypes: EnumTuple[];

	allStops$: Observable<TransModelStopsViewModel[]>;
	autocompleteStopsLoading = false;
	autocompleteStopsInput$ = new Subject<string>();

	allLines$: Observable<TransModelLineViewModel[]>;
	stopList: TransModelStopsViewModel[] = [];
	operatorList: ITransModelOperatorType[] = [];

	loadingOperators = false;
	loadingLines = false;
	loadingStops = false;

	missingReferenceWarning = null;

	@Output() save = new EventEmitter();
	@Output() cancel = new EventEmitter();

	@ViewChildren('modeButton') modeButtons: QueryList<ElementRef>;
	modeButtonLeftValues: any[];

	@ViewChildren('typeButton') typeButtons: QueryList<ElementRef>;
	typeButtonLeftValues: any[];

	@ViewChild('operator_selector', { static: false }) operatorSelector;

	title = 'Add an impact';

	constructor(
		private formBuilder: FormBuilder,
		private transModelService: TransModelService,
		private impactMapService: ImpactMapService,
		private modalService: NgxSmartModalService,
		private settingsStore: SettingsStore
	) {
		super();
		this.impactGroup = this.formBuilder.group(new ImpactComponentForm(), {
			validator: ImpactTypeValidator.conditionalFields()
		});
	}

	private static compareEntityIds(prev: object[], curr: object[]): boolean {
		// Used by distinctUntilChanged to compare a list of stop objects.
		if (!prev && !curr) {
			// If both are undefined, they are the same.
			return true;
		}
		if (prev && curr) {
			if (prev.length !== curr.length) {
				// If they are different lengths, they are different.
				return false;
			}
			// If they have the same lengths, entityIds should match.
			const diff = differenceBy(curr, prev, 'entityId');
			return !diff.length;
		}
		return false;
	}

	ngOnInit() {
		this.setupReferenceData();
		this.autoCompleteStops();
		this.subscriptions.push(
			this.impactGroup.valueChanges.subscribe(val => {
				this.value = val;
				this.onChange(val);
			})
		);
		this.subscribeToModeChanges();
		this.subscribeToStopChanges();
		this.subscribeToMapChanges();
	}

	ngOnDestroy() {
		this.subscriptions.map(s => s.unsubscribe());
		this.missingReferenceWarning = '';
	}

	ngAfterContentChecked() {
		if (this.modeButtons) {
			this.modeButtonLeftValues = this.modeButtons.map(m => {
				return m.nativeElement.offsetLeft;
			});
		}

		if (this.typeButtons) {
			this.typeButtonLeftValues = this.typeButtons.map(m => {
				return m.nativeElement.offsetLeft;
			});
		}
	}

	ngAfterViewInit(): void {
		this.modalService.getModal('impact-modal').onClose.subscribe(() => {
			FormGroupHelper.likeAVirgin(this.impactGroup);
			this.resetMap();
			this.stopList = [];
		});
	}

	onCancel() {
		FormGroupHelper.likeAVirgin(this.impactGroup);
		// called by clicking cancel button, passes event up to parent to close modal
		this.resetMap();
		this.stopList = [];
		this.missingReferenceWarning = null;
		this.cancel.emit();
	}

	onOK() {
		// called by clicking ok button, validates form, and passes event up to parent to close modal
		if (this.impactGroup.valid) {
			FormGroupHelper.likeAVirgin(this.impactGroup);
			this.save.emit();
			this.missingReferenceWarning = null;
		} else {
			// use inappropriate touching to highlight any required fields
			FormGroupHelper.whenIthinkAboutYou(this.impactGroup);
		}
		this.stopList = [];
	}

	offsetMode(i: number) {
		return this.modeButtonLeftValues && this.modeButtonLeftValues[i];
	}

	offsetType(i: number) {
		return this.typeButtonLeftValues && this.typeButtonLeftValues[i];
	}

	private setupReferenceData() {
		this.allModes = EnumFormatter.toHumanisedDictionary(IModeInput);
		this.settingsStore.severityList$().subscribe(s => {
			if (s) {
				this.severities = clone(s);
				this.severities.unshift({ value: '', title: '' });
			}
		});
		this.settingsStore.directionList$().subscribe(d => {
			if (d) {
				this.directions = clone(d);
				this.directions.unshift({ value: '', title: ALL_DIRECTIONS });
			}
		});

		this.impactTypes = [
			{ value: IImpactType.Network, title: 'Network wide' },
			{ value: IImpactType.Operator, title: 'Operator wide' },
			{ value: IImpactType.Service, title: 'Services' },
			{ value: IImpactType.Stops, title: 'Stops' }
		];
	}

	private subscribeToModeChanges() {
		this.subscriptions.push(
			this.impactGroup
				.get('mode')
				.valueChanges.pipe(distinctUntilChanged())
				.subscribe(mode => {
					if (!mode) { return; }
					if (mode === 'Train') {
						// There is a discrepancy between values in backend and in FE.
						mode = 'Rail';
					}
					const modes = [IModeTypeEnum[mode] as IModeTypeEnum];
					if (mode === IModeInput.Tram) {
						// Tram includes metro as well.
						modes.push(IModeTypeEnum.Metro);
					}
					this.transModelService.setModes(modes);
					this.loadOperators();
					this.getLines();
				})
		);
	}

	private loadOperators() {
		this.loadingOperators = true;
		this.subscriptions.push(
			this.transModelService
				.listOperators()
				.pipe(tap((result) => result && (this.loadingOperators = false)))
				.subscribe(operators => {
					this.operatorList = operators;
				})
		);
	}

	private subscribeToStopChanges() {
		this.subscriptions.push(
			this.impactGroup
				.get('stops')
				.valueChanges.pipe(distinctUntilChanged((prev, curr) => ImpactComponent.compareEntityIds(prev, curr)))
				.subscribe(stops => {
					if (stops.length) {
						this.impactMapService.setSelectedStops(stops);
					}
				})
		);
	}

	onStopAdded(stop) {
		this.impactMapService.populateLinesFromStopChange(stop);
	}

	private subscribeToMapChanges() {
		this.subscriptions.push(
			this.impactMapService.selectedStops$
				.pipe(distinctUntilChanged((prev, curr) => ImpactComponent.compareEntityIds(prev, curr)))
				.subscribe(stops => {
					this.impactGroup.patchValue({ stops });
				})
		);
		this.subscriptions.push(
			this.impactMapService.stops$
				.pipe(distinctUntilChanged((prev, curr) => ImpactComponent.compareEntityIds(prev, curr)))
				.subscribe(stops => {
					this.stopList = this.deDupeStops(stops);
				})
		);
		this.subscriptions.push(
			this.impactMapService.selectedLines$
				.pipe(distinctUntilChanged((prev, curr) => ImpactComponent.compareEntityIds(prev, curr)))
				.subscribe(lines => {
					const sorted = sortBy(lines, [(o) => parseInt(o.name, 10)]);
					this.impactGroup.patchValue({ lines: sorted });
					this.setOperatorsForLines();
				})
		);
	}

	private getLines() {
		this.disableControls();
		this.loadingLines = true;
		this.allLines$ = this.transModelService.allLines([]).pipe(
			tap(lines => {
				if (!lines) { return; }
				if (!this.lines.value.length) {
					this.loadingLines = false;
					this.enableControls();
				}
				this.impactMapService.setAllLines(lines);
			})
		);
	}

	private autoCompleteStops() {
		this.allStops$ = concat(
			of([]), // default items
			this.autocompleteStopsInput$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.autocompleteStopsLoading = true)),
				switchMap(term =>
					this.transModelService.searchStops(term).pipe(
						catchError(() => of([])), // empty list on error
						tap(() => (this.autocompleteStopsLoading = false))
					)
				)
			)
		);
		this.subscriptions.push(
			this.allStops$.subscribe(stops => this.impactMapService.setStops(this.stops.value.concat(stops)))
		);
	}

	addService(line) {
		this.loadingStops = true;
		this.subscriptions.push(
			this.transModelService
				.line(line.entityId)
				.pipe(tap((result) => result && (this.loadingStops = false)))
				.subscribe(result => {
					this.stopList = this.deDupeStops(TransModelLineViewMapper.getStops(result));
					this.impactMapService.addLine(result);
					this.impactMapService.setStops(this.stopList);
					this.updateSelectedStops();
				})
		);
	}

	addServices(lines: TransModelLineViewModel[]) {
		if (!lines || !lines.length) {
			return;
		}
		this.loadingLines = true;
		this.loadingStops = true;
		this.disableControls();
		const requests = lines.reduce(
			(map, line) => {
				map[line.entityId] = this.transModelService.line(line.entityId);
				return map;
			}, {});
		forkJoin(requests)
			.pipe(
				tap((result) => {
					if (result) {
						this.loadingLines = false;
						this.loadingStops = false;
						this.enableControls();
					}
				})
			)
			.subscribe(results => {
				if (this.selectedType === 'Service') {
					this.stopList = this.deDupeStops(
						flatten(values(results).map(result => result ? TransModelLineViewMapper.getStops(result) : []))
					);
					const missingReferences = lines.filter(line => results[line.entityId] === null).map(line => line.featureName);
					if (missingReferences.length) {
						this.missingReferenceWarning = 'These services are no longer valid and have been removed from the impact: ' + missingReferences.join(', ');
					}
					this.impactMapService.setLines(values(results));
					this.impactMapService.setStops(this.stopList);
					this.updateSelectedStops();
				}
			});
	}

	private deDupeStops(stops): TransModelStopsViewModel[] {
		// Merge line references for stops that are a part of multiple lines.
		const deDupedStops = {};
		if (!stops) {
			return this.stopList;
		}
		stops = stops.concat(this.stopList);
		stops.forEach(stop => {
			if (has(deDupedStops, stop.entityId)) {
				const lineIds = new Set(deDupedStops[stop.entityId].lineIds.concat(stop.lineIds));
				deDupedStops[stop.entityId].lineIds = Array.from(lineIds) as string[];
			} else {
				deDupedStops[stop.entityId] = stop;
			}
		});
		return values(deDupedStops);
	}

	private updateSelectedStops() {
		if (this.stops.value) {
			const selectedStops = sortBy(this.stopList.filter(item =>
				this.stops.value.some(stop => stop.entityId === item.entityId)
			), 'featureName');
			// Update the selected stops with richer values.
			this.impactMapService.setSelectedStops(selectedStops);
			this.stops.setValue(selectedStops);
		}
	}

	private setOperatorsForLines() {
		const toSelect = {};
		this.lines.value.map(line => {
			const operators = this.operatorList.filter(item =>
				line.operatorEntityIds.some(eid => eid === item.entityId)
			);
			operators.forEach(op => (toSelect[op.entityId] = op));
		});
		this.operators.setValue(values(toSelect));
	}

	private removeStopsForLine(line: TransModelLineViewModel) {
		if (this.stops.value) {
			const stops = this.stops.value
				.filter(stop => {
					const idx = stop.lineIds.findIndex(s => s === line.entityId);
					if (idx !== -1) {
						stop.lineIds.splice(idx, 1);
					}
					return stop.lineIds.length;
				})
				.filter(stop => Object.keys(stop).length);
			this.stops.setValue(stops);
		}

		// Also update the stopList
		this.stopList = this.stopList
			.filter(stop => {
				const idx = stop.lineIds.findIndex(s => s === line.entityId);
				if (idx !== -1) {
					stop.lineIds.splice(idx, 1);
				}
				return stop.lineIds.length;
			})
			.filter(stop => Object.keys(stop).length);
	}

	removeService(event) {
		const line = event.value;
		this.impactMapService.removeLine(line);
		// Remove any stops that are linked to this service.
		this.removeStopsForLine(line);
		this.setOperatorsForLines();
	}

	public trackAutocompleteSelection(item: any) {
		return item.entityId;
	}

	// Mode methods
	setMode(val: string) {
		this.impactGroup.patchValue({
			mode: val || null
		});
		FormGroupHelper.likeAVirgin(this.impactGroup);
	}

	clearMode() {
		this.impactGroup.patchValue({
			mode: null,
			type: null,
			operators: [],
			lines: [],
			stops: []
		});
		this.resetMap();
	}

	get selectedMode(): string {
		const val = this.impactGroup.get('mode').value;
		return val !== null ? this.impactGroup.get('mode').value : '';
	}

	get modeIsSet(): boolean {
		return this.impactGroup.get('mode').value !== null;
	}

	private resetLoadingState() {
		this.loadingLines = false;
		this.loadingOperators = false;
		this.loadingStops = false;
	}

	// Type methods
	setType(val: string) {
		this.impactGroup.patchValue({
			type: val || null
		});
		FormGroupHelper.likeAVirgin(this.impactGroup);
		this.enableControls();
		this.resetMap();
	}

	get selectedType(): string {
		return this.impactGroup.get('type').value;
	}

	get typeIsSet(): boolean {
		return this.impactGroup.get('type').value !== null;
	}

	clearType() {
		this.impactGroup.patchValue({
			type: null,
			operators: [],
			lines: [],
			stops: []
		});
		this.resetMap();
	}

	private resetMap() {
		this.impactMapService.resetMapData();
	}

	get advice() {
		return this.impactGroup.get('advice');
	}

	// Validation
	hasError(key: string): boolean {
		const prop = this.impactGroup.get(key);
		return l.get(this.impactGroup, `errors.${key}`) && (prop.dirty || prop.touched);
	}

	propInvalid(propName: string): boolean {
		const prop = this.impactGroup.get(propName);
		return prop.invalid && (prop.dirty || prop.touched);
	}

	writeValue(impact: ImpactComponentForm) {
		if (impact) {
			this.value = impact;
			this.initForm();
		}
	}
	private initForm() {
		if (this.value.id === '') {
			this.title = 'Add an impact';
		} else {
			this.title = 'Edit an impact';
		}

		if (this.value.severity[0] && this.severities.findIndex(s => s.value === this.value.severity[0]) === -1) {
			this.severities.push({
				title: EnumFormatter.toPrettyString(this.value.severity[0].toString()),
				value: this.value.severity[0]
			} as EnumTuple);
		}

		if (this.value.direction[0] && this.directions.findIndex(s => s.value === this.value.direction[0]) === -1) {
			this.directions.push({
				title: EnumFormatter.toPrettyString(this.value.direction[0].toString()),
				value: this.value.direction[0]
			} as EnumTuple);
		}

		this.impactGroup.patchValue({
			id: this.value.id,
			mode: this.value.mode[0],
			advice: this.value.advice[0],
			journeyPlanners: this.value.journeyPlanners[0],
			delay: this.value.delay[0],
			severity: this.value.severity[0],
			type: this.value.type[0],
			direction: this.value.direction[0] ? this.value.direction[0] : '',
			operators: this.value.operators[0],
			lines: this.value.lines[0],
			stops: this.value.stops[0]
		});
		this.addServices(this.value.lines);
		this.impactMapService.setSelectedStops(this.value.stops);
	}

	validate(c: AbstractControl): ValidationErrors | null {
		return this.impactGroup.valid ? null : { errors: FormGroupHelper.getAllErrors(this.impactGroup) };
	}

	get stops() {
		return this.impactGroup.get('stops');
	}

	get lines() {
		return this.impactGroup.get('lines');
	}

	get operators() {
		return this.impactGroup.get('operators');
	}

	get delay() {
		return this.impactGroup.get('delay');
	}

	private disableControls() {
		if (this.selectedType === 'Service') {
			this.stops.disable();
			this.lines.disable();
			this.operators.disable();
		}
	}

	private enableControls() {
		this.stops.enable();
		this.lines.enable();
		this.operators.enable();
	}
}
