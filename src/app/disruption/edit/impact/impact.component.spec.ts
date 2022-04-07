import { ImpactComponent } from './impact.component';
import { ComponentFixture, async, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IModeInput, IModeTypeEnum } from 'src/generated/graphql';
import { EnumFormatter, EnumTuple } from 'src/app/shared/formatters/enum.formatter';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { IImpactType } from 'src/app/shared/impact.type.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransModelService } from '../../../shared/components/transport-data/transmodel.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ImpactMapComponent } from '../impact-map/impact-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { TransModelLineViewMapper } from '../../../shared/components/transport-data/transmodel.view.mapper';
import { TransModelLineViewModel, TransModelStopsViewModel } from '../../../shared/components/transport-data/transmodel.view.model';
import { ImpactMapService } from '../impact-map/impact-map.service';
import {
	lines,
	line08,
	operators,
	linesGeoJson,
	lineStopsGeoJson,
	stopViewModel,
	stopsGeoJson
} from '../impact-map/impact-map.spec.data';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash';
import { By } from '@angular/platform-browser';
import { SettingsStore } from 'src/app/settings/settings.store';

describe('ImpactComponent', () => {
	let component: ImpactComponent;
	let fixture: ComponentFixture<ImpactComponent>;
	let formBuilder: FormBuilder;
	let transModelService: TransModelService;
	let transModelMapper: TransModelLineViewMapper;
	let impactMapService: ImpactMapService;
	let settingsStore: SettingsStore;
	let linesViewModel: TransModelLineViewModel[];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactComponent, ImpactMapComponent],
			imports: [
				ReactiveFormsModule,
				AngularSvgIconModule,
				SharedModule,
				NgSelectModule,
				ApolloTestingModule,
				RouterTestingModule,
				HttpClientTestingModule,
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				NgxSpinnerModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [TransModelService, FormBuilder]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactComponent);
		transModelService = fixture.debugElement.injector.get(TransModelService);
		transModelMapper = fixture.debugElement.injector.get(TransModelLineViewMapper);
		impactMapService = fixture.debugElement.injector.get(ImpactMapService);
		formBuilder = fixture.debugElement.injector.get(FormBuilder);
		component = fixture.componentInstance;
		// Disable modal logic.
		spyOn(component, 'ngAfterViewInit').and.returnValue(null);
		fixture.detectChanges();
		const ops$ = cold('a|', { a: operators });
		spyOn(transModelService, 'listOperators').and.returnValue(ops$);
		linesViewModel = lines.map(line => TransModelLineViewMapper.toTransModelLineViewModel(line));
		settingsStore = TestBed.get(SettingsStore);
	});

	it('should create', () => {
		component.ngOnInit();
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('h2').textContent).toBe('Add an impact');
		expect(component).toBeTruthy();
	});

	it('should initialise the form', () => {
		expect(component.impactGroup).toBeTruthy();
	});

	it('should setup test data on init', fakeAsync(() => {
		component.ngOnInit();

		const directions: EnumTuple[] = [];
		const directions$ = cold('a|', { a: directions });
		spyOn(settingsStore, 'directionList$').and.returnValue(directions$);

		const severity: EnumTuple[] = [];
		const severity$ = cold('a|', { a: severity });
		spyOn(settingsStore, 'severityList$').and.returnValue(severity$);

		expect(component.allModes).toEqual(EnumFormatter.toHumanisedDictionary(IModeInput));
		expect(component.impactTypes).toEqual([
			{ value: 'Network', title: 'Network wide' },
			{ value: 'Operator', title: 'Operator wide' },
			{ value: 'Service', title: 'Services' },
			{ value: 'Stops', title: 'Stops' }
		]);

		flush();
		settingsStore.directionList$().subscribe(s => {
			fixture.detectChanges();
			component.directions = s;
		});

		settingsStore.severityList$().subscribe(s => {
			fixture.detectChanges();
			component.severities = s;
		});
	}));

	it('should fail to emit save when form is blank', () => {
		spyOn(component.save, 'emit');

		component.ngOnInit();
		component.onOK();
		fixture.detectChanges();

		expect(component.save.emit).toHaveBeenCalledTimes(0);
	});

	it('should set form elements to touched when fail to save.', () => {
		spyOn(FormGroupHelper, 'whenIthinkAboutYou');

		component.ngOnInit();
		component.onOK();
		fixture.detectChanges();

		expect(FormGroupHelper.whenIthinkAboutYou).toHaveBeenCalledTimes(1);
		expect(FormGroupHelper.whenIthinkAboutYou).toHaveBeenCalledWith(component.impactGroup);
	});

	it('should emit save when form valid.', () => {
		spyOn(component.save, 'emit');

		component.ngOnInit();

		component.impactGroup.patchValue({
			mode: 'this is required',
			advice: 'this is required',
			journeyPlanners: 'this is required',
			direction: null,
			delay: 923,
			severity: 'this is required',
			type: IImpactType.Network
		});

		component.onOK();
		fixture.detectChanges();

		expect(component.save.emit).toHaveBeenCalledTimes(1);
	});

	it('should emit cancel', () => {
		spyOn(component.cancel, 'emit');

		component.ngOnInit();
		component.onCancel();
		fixture.detectChanges();

		expect(component.cancel.emit).toHaveBeenCalledTimes(1);
	});

	it('should add metro to modes when tram selected', () => {
		// init with empty mode.
		const spy = spyOn(transModelService, 'setModes');
		component.impactGroup.patchValue({
			mode: ''
		});

		// subscribe to changes.
		component.ngOnInit();

		component.impactGroup.patchValue({
			mode: IModeInput.Tram
		});

		expect(spy).toHaveBeenCalledWith([IModeTypeEnum.Tram, IModeTypeEnum.Metro]);
	});

	it('should subscribe to mode changes and get all lines', () => {
		// subscribe to changes.
		const spy = spyOn(transModelService, 'setModes');

		// init with empty operator but line.
		component.impactGroup.patchValue({
			mode: 'Bus'
		});
		component.ngOnInit();

		expect(spy).toHaveBeenCalledWith([IModeTypeEnum.Bus]);
		expect(component.lines.value).toEqual([]);
	});

	it('should subscribe to line changes and update stops', () => {
		const obs$ = cold('a|', { a: lines });
		spyOn(transModelService, 'line').and.returnValue(obs$);

		// init with empty line.
		component.impactGroup.patchValue({
			lines: [],
			stops: []
		});

		// subscribe to changes.
		component.ngOnInit();

		component.impactGroup.patchValue({
			lines: [{ entityId: 'LINE1' }]
		});
		component.addService({ entityId: 'LINE1' });

		expect(transModelService.line).toHaveBeenCalledWith('LINE1');
		expect(component.impactGroup.get('stops').value).toEqual([]);
	});

	it('Update stops when line is selected', () => {
		const stop1 = {
			displayName: 'Display Name',
			featureName: 'feat. name',
			entityId: 'stop1',
			atcoCode: '111',
			stopType: null,
			lat: 0,
			lon: 0,
			selected: false,
			lineIds: [],
			features: []
		};
		const stop2 = {
			displayName: 'Display Name',
			featureName: 'feat. name',
			entityId: 'stop2',
			atcoCode: '111',
			stopType: null,
			lat: 0,
			lon: 0,
			selected: true,
			lineIds: [],
			features: []
		};

		const stops = [stop2, stop1];
		const mapServiceSpy = spyOn(impactMapService, 'setStops').and.callThrough();
		spyOn(TransModelLineViewMapper, 'getStops').and.returnValue([stop2 as TransModelStopsViewModel]);

		const lineObs$ = cold('a', { a: lines });
		spyOn(transModelService, 'line').and.returnValue(lineObs$);

		// init with empty line.
		component.impactGroup.patchValue({
			lines: [],
			stops: [stop1]
		});

		// subscribe to changes.
		component.ngOnInit();

		component.addService({ entityId: 'LINE1' });
		expect(transModelService.line).toHaveBeenCalledWith('LINE1');

		getTestScheduler().flush();
		fixture.detectChanges();

		expect(mapServiceSpy).toHaveBeenCalledWith(stops);
		expect(component.impactGroup.get('stops').value).toEqual(stops);
	});

	// can't quite get this one right.
	xit('should search for stops', fakeAsync(() => {
		spyOn(transModelService, 'searchStops');
		component.autocompleteStopsLoading = true;
		component.autocompleteStopsInput$.next('');

		component.ngOnInit();
		component.autocompleteStopsInput$.next('val');

		component.autocompleteStopsInput$.subscribe(() => {
			tick(3000);
			flush();
		});
		expect(transModelService.searchStops).toHaveBeenCalledWith('search');
	}));

	it('should track autocomplete by entity id', () => {
		const stop1 = {
			displayName: 'Display Name',
			featureName: 'feat. name',
			entityId: 'stop1',
			atcoCode: 'fakeAtcoCode',
			stopType: null,
			lat: 0,
			lon: 0
		};

		const id = component.trackAutocompleteSelection(stop1);

		expect(id).toBe(stop1.entityId);
	});

	it('should clear type, operator and line when mode changes', () => {
		component.ngOnInit();

		component.impactGroup.patchValue({
			mode: IModeInput.Tram,
			type: 'Network',
			operator: { entityId: 1 },
			line: { entityId: 2 }
		});

		component.clearMode();

		expect(component.impactGroup.get('lines').value).toEqual([]);
		expect(component.impactGroup.get('operators').value).toEqual([]);
		expect(component.impactGroup.get('type').value).toEqual(null);
	});

	it('should validate advice for Profanity.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();

		component.impactGroup.patchValue({
			type: IImpactType.Network,
			mode: IModeInput.Bus
		});
		tick();
		fixture.detectChanges();

		const advice = fixture.debugElement.query(By.css('#impact-advice'));
		// Apologies for profanity, but this is a profanity test.
		advice.nativeElement.value = 'Assface';
		advice.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Please refrain from using profane words in text.');
	}));

	it('should validate advice for non-ascii characters.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();

		component.impactGroup.patchValue({
			type: IImpactType.Network,
			mode: IModeInput.Bus
		});
		tick();
		fixture.detectChanges();

		const advice = fixture.debugElement.query(By.css('#impact-advice'));
		advice.nativeElement.value = 'This is an advice with É character';
		advice.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Non-printable character É is not allowed.');
	}));
});

describe('ImpactComponent (multi-line and map)', () => {
	let component: ImpactComponent;
	let fixture: ComponentFixture<ImpactComponent>;
	let formBuilder: FormBuilder;
	let transModelService: TransModelService;
	let transModelMapper: TransModelLineViewMapper;
	let impactMapService: ImpactMapService;
	let linesViewModel: TransModelLineViewModel[];
	let allLinesObs$: Observable<TransModelLineViewModel[]>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactComponent, ImpactMapComponent],
			imports: [
				ReactiveFormsModule,
				AngularSvgIconModule,
				SharedModule,
				NgSelectModule,
				ApolloTestingModule,
				RouterTestingModule,
				HttpClientTestingModule,
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				NgxSpinnerModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [TransModelService, FormBuilder]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactComponent);
		transModelService = fixture.debugElement.injector.get(TransModelService);
		transModelMapper = fixture.debugElement.injector.get(TransModelLineViewMapper);
		impactMapService = fixture.debugElement.injector.get(ImpactMapService);
		formBuilder = fixture.debugElement.injector.get(FormBuilder);
		component = fixture.componentInstance;
		// Disable modal logic.
		spyOn(component, 'ngAfterViewInit').and.returnValue(null);
		component.impactGroup.patchValue({
			type: '',
			mode: '',
			lines: [],
			stops: []
		});
		fixture.detectChanges();
	});

	beforeEach(fakeAsync(() => {
		const ops$ = cold('a|', { a: operators });
		spyOn(transModelService, 'listOperators').and.returnValue(ops$);
		linesViewModel = lines.map(line => TransModelLineViewMapper.toTransModelLineViewModel(line));
		allLinesObs$ = cold('a|', { a: linesViewModel });
		spyOn(transModelService, 'allLines').and.returnValue(allLinesObs$);
		getTestScheduler().flush();
		fixture.detectChanges();
	}));

	it('Stops are de-duped when multiple lines are selected', fakeAsync(() => {
		const secondLine = cloneDeep(line08);
		secondLine.features.push({
			type: 'Feature',
			properties: {
				id: 'stop1',
				feature_name: 'stop1'
			},
			geometry: {
				type: 'Point',
				coordinates: [1.0, 1.0]
			}
		});
		const secondLineVM = TransModelLineViewMapper.toTransModelLineViewModel(secondLine);
		const lineObs$ = cold('a|', { a: linesViewModel[0] });
		const secondLineObs$ = cold('a|', { a: secondLineVM });
		const lineSpy = spyOn(transModelService, 'line').and.returnValues(lineObs$, secondLineObs$);

		// subscribe to changes.
		component.ngOnInit();
		component.impactGroup.patchValue({
			type: IImpactType.Service,
			mode: IModeInput.Bus,
			lines: [{ ref: 'LIN007', name: 'Line 007' }]
		});
		getTestScheduler().flush();
		fixture.detectChanges();

		component.addServices(linesViewModel);
		getTestScheduler().flush();
		fixture.detectChanges();
		expect(lineSpy).toHaveBeenCalledWith('LIN007');
		expect(component.stopList.length).toEqual(1);

		component.addService(secondLineVM);
		getTestScheduler().flush();
		fixture.detectChanges();
		expect(lineSpy).toHaveBeenCalledWith('LIN008');

		expect(component.stopList.length).toEqual(2);
		component.stopList.map(stop => {
			if (stop.entityId === 'stop1') {
				expect(stop.lineIds).toEqual(['LIN008', 'LIN007']);
			}
		});
	}));

	it('Setting a line should show operator', fakeAsync(() => {
		const lineObs$ = cold('--a|', { a: linesViewModel[0] });
		spyOn(transModelService, 'line').and.returnValue(lineObs$);

		// subscribe to changes.
		component.ngOnInit();
		component.impactGroup.patchValue({
			type: IImpactType.Service,
			mode: IModeInput.Bus
		});
		component.operatorList = operators;
		// Let the allLines request finish.
		getTestScheduler().flush();
		fixture.detectChanges();

		component.addService(linesViewModel[0]);

		getTestScheduler().flush();
		fixture.detectChanges();
		expect(component.operators.value[0].entityId).toEqual('OOP1');
	}));
});

describe('ImpactComponent map updates', () => {
	let component: ImpactComponent;
	let fixture: ComponentFixture<ImpactComponent>;
	let formBuilder: FormBuilder;
	let transModelService: TransModelService;
	let transModelMapper: TransModelLineViewMapper;
	let impactMapService: ImpactMapService;
	let linesViewModel: TransModelLineViewModel[];
	let allLinesObs$: Observable<TransModelLineViewModel[]>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactComponent, ImpactMapComponent],
			imports: [
				ReactiveFormsModule,
				AngularSvgIconModule,
				SharedModule,
				NgSelectModule,
				ApolloTestingModule,
				RouterTestingModule,
				HttpClientTestingModule,
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				NgxSpinnerModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [TransModelService, FormBuilder]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactComponent);
		transModelService = fixture.debugElement.injector.get(TransModelService);
		transModelMapper = fixture.debugElement.injector.get(TransModelLineViewMapper);
		impactMapService = fixture.debugElement.injector.get(ImpactMapService);
		formBuilder = fixture.debugElement.injector.get(FormBuilder);
		component = fixture.componentInstance;
		// Disable modal logic.
		spyOn(component, 'ngAfterViewInit').and.returnValue(null);
		component.impactGroup.patchValue({
			type: '',
			mode: '',
			lines: [],
			stops: []
		});
		fixture.detectChanges();
	});

	beforeEach(fakeAsync(() => {
		const ops$ = cold('a|', { a: operators });
		spyOn(transModelService, 'listOperators').and.returnValue(ops$);
		linesViewModel = lines.map(line => TransModelLineViewMapper.toTransModelLineViewModel(line));
		allLinesObs$ = cold('a|', { a: linesViewModel });
		spyOn(transModelService, 'allLines').and.returnValue(allLinesObs$);
		getTestScheduler().flush();
		fixture.detectChanges();
	}));

	it('Adding a line should update map service', fakeAsync(() => {
		const lineObs$ = cold('--a|', { a: linesViewModel[0] });
		spyOn(transModelService, 'line').and.returnValue(lineObs$);
		const addLineSpy = spyOn(impactMapService, 'addLine').and.callThrough();

		// subscribe to changes.
		component.ngOnInit();
		component.impactGroup.patchValue({
			type: IImpactType.Service,
			mode: IModeInput.Bus
		});
		// Let the allLines request finish.
		getTestScheduler().flush();
		fixture.detectChanges();

		component.addService(linesViewModel[0]);

		getTestScheduler().flush();
		fixture.detectChanges();
		expect(addLineSpy).toHaveBeenCalled();
		impactMapService.stopsGeoJson$.subscribe(s => expect(s).toEqual(lineStopsGeoJson));
		impactMapService.linesGeoJson$.subscribe(geojson => expect(geojson).toEqual(linesGeoJson));
		impactMapService.changeZoom$.subscribe(zoom => expect(zoom).toEqual('stop'));
	}));

	it('Removing a line should update map service', fakeAsync(() => {
		const addLineSpy = spyOn(impactMapService, 'removeLine');

		// subscribe to changes.
		component.ngOnInit();
		component.impactGroup.patchValue({
			type: IImpactType.Service,
			mode: IModeInput.Bus
		});
		// Let the allLines request finish.
		getTestScheduler().flush();
		fixture.detectChanges();

		component.removeService({ value: linesViewModel[0] });
		getTestScheduler().flush();
		fixture.detectChanges();
		expect(addLineSpy).toHaveBeenCalled();

		impactMapService.linesGeoJson$.subscribe(geojson => expect(geojson.features).toEqual([]));
		impactMapService.changeZoom$.subscribe(zoom => expect(zoom).toEqual('stop'));
	}));

	it('Setting stops updates map', fakeAsync(() => {
		const setStopsSpy = spyOn(impactMapService, 'setSelectedStops').and.callThrough();

		// subscribe to changes.
		component.ngOnInit();
		component.impactGroup.patchValue({
			type: IImpactType.Stops,
			mode: IModeInput.Bus,
			stops: [stopViewModel]
		});
		// Let the allLines request finish.
		impactMapService.setStops([stopViewModel]);
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(setStopsSpy).toHaveBeenCalled();
		const expectedVal = cloneDeep(stopsGeoJson);
		expectedVal.features[0].properties.selected = true;
		impactMapService.stopsGeoJson$.subscribe(s => expect(s).toEqual(expectedVal));
		impactMapService.changeZoom$.subscribe(zoom => expect(zoom).toEqual('stop'));
		tick(500);
	}));
});
