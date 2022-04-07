import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { EditDisruptionComponent } from './edit-disruption.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { OverviewComponent } from './overview/overview.component';
import { MessagingComponent } from './messaging/messaging.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ImpactsListComponent } from './impacts-list/impacts-list.component';
import { ImpactComponent } from './impact/impact.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { EditDisruptionService } from './edit-disruption.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { TabsService } from '../../shared/components/tabs/tabs.service';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import { Location } from '@angular/common';
import { IFormSubmittedState } from 'src/app/shared/forms/FormStateEnum';
import * as moment from 'moment';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { _ } from 'ag-grid-community';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisruptionsListComponent } from '../../disruptions-list/disruptions-list.component';
import { DisruptionsListModule } from '../../disruptions-list/disruptions-list.module';
import { ImpactMapComponent } from './impact-map/impact-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../../../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { flushTickAndDetectChanges } from '../../shared/testing/ng-select-helpers';

describe('EditDisruptionComponent', () => {
	let component: EditDisruptionComponent;
	let fixture: ComponentFixture<EditDisruptionComponent>;
	let editDisruptionService: EditDisruptionService;
	let tabService: TabsService;
	let formBuilder: FormBuilder;
	let disruptionObs$: Observable<IEditDisruptionViewModel>;
	let modalService: NgxSmartModalService;

	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);

	const mockLocation = {
		replaceState: jasmine.createSpy('replaceState'),
		subscribe: jasmine.createSpy()
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				EditDisruptionComponent,
				ImpactsListComponent,
				ImpactComponent,
				OverviewComponent,
				MessagingComponent,
				ImpactMapComponent
			],
			imports: [
				CommonModule,
				FormsModule,
				SharedModule,
				NgSelectModule,
				ReactiveFormsModule,
				DisruptionsListModule,
				RouterTestingModule.withRoutes([{ path: 'disruptions', component: DisruptionsListComponent }]),
				NgxSmartModalModule.forRoot(),
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				BrowserModule,
				BrowserAnimationsModule,
				ApolloTestingModule,
				HttpClientTestingModule,
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				NgxSpinnerModule,
			],
			providers: [
				EditDisruptionService,
				FormBuilder,
				TabsService,
				{ provide: Location, useValue: mockLocation }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		tabService = TestBed.get(TabsService);
		editDisruptionService = TestBed.get(EditDisruptionService);
		modalService = TestBed.get(NgxSmartModalService);
		formBuilder = TestBed.get(FormBuilder);

		fixture = TestBed.createComponent(EditDisruptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		const activatedRoute = TestBed.get(ActivatedRoute);
		const urlSegments: UrlSegment[] = [new UrlSegment('template', {}), new UrlSegment('edit', {})];
		const url$ = cold('a|', { urlSegments });
		spyOn(activatedRoute, 'url').and.returnValue(url$);

		(mockModal.open as jasmine.Spy).calls.reset();
		(mockModal.close as jasmine.Spy).calls.reset();
	});

	it('should create', () => {
		disruptionObs$ = cold('a|', { a: null });
		spyOnProperty(editDisruptionService, 'currentDisruption$').and.returnValue(disruptionObs$);
		component.ngOnInit();

		expect(component).toBeTruthy();
	});

	it('should initialise tabs service', () => {
		spyOn(tabService, 'init');

		component.ngOnInit();

		expect(tabService.init).toHaveBeenCalledWith(['Overview', 'Impacts', 'Messaging']);
	});

	it('should initialise the form', () => {
		component.ngOnInit();

		expect(component.disruptionForm.get('id')).toBeTruthy();
		expect(component.disruptionForm.get('submitComment')).toBeTruthy();
		expect(component.disruptionForm.get('impactGroup')).toBeTruthy();
		expect(component.disruptionForm.get('overviewGroup')).toBeTruthy();
		expect(component.disruptionForm.get('messagingGroup')).toBeTruthy();
	});

	it('should set title to add', () => {
		component.ngOnInit();

		expect(component.pageTitle).toBe('Add a new disruption');
	});

	it('should set title to edit', () => {
		component.ngOnInit();
		component.disruptionForm.patchValue({ id: '23' });
		fixture.detectChanges();

		expect(component.pageTitle).toBe('Edit a disruption');
	});

	it('should set the id when returned from created disruption', () => {
		const disruption: IEditDisruptionViewModel = {
			id: 'new_id',
			decodedId: '1',
			summary: 'Summary'
		};

		disruptionObs$ = cold('-a|', { a: disruption });
		spyOnProperty(editDisruptionService, 'currentDisruption$').and.returnValue(disruptionObs$);
		component.ngOnInit();

		disruptionObs$.subscribe(() => {
			expect(component.disruptionForm.get('id').value).toEqual('new_id');
			expect(mockLocation.replaceState).toHaveBeenCalledWith(`disruption/edit/${disruption.decodedId}`);
		});
	});

	it('should save draft when no errors with summary', () => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set'
		});

		spyOn(editDisruptionService, 'saveDisruption');

		component.ngOnInit();
		component.onSave();

		expect(editDisruptionService.saveDisruption).toHaveBeenCalled();
	});

	it('should not save draft with invalid link', () => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set'
		});
		component.disruptionForm.get('overviewGroup').setErrors({ errors: { link: { pattern: true } } });

		spyOn(editDisruptionService, 'saveDisruption');

		component.onSave();

		expect(editDisruptionService.saveDisruption).toHaveBeenCalledTimes(0);
	});

	it('should set the modified string to draft', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Saved });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);
		component.isTemplateMode = false;
		component.ngOnInit();

		formStatus$.subscribe(() => {
			const time = moment().format('HH:mm:ss');
			expect(component.modified).toBe(`Draft saved at ${time}`);
		});
	});

	it('should set the modified string to template', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Saved });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);
		component.ngOnInit();

		component.isTemplateMode = true;
		formStatus$.subscribe(() => {
			const time = moment().format('HH:mm:ss');
			expect(component.modified).toBe(`Template saved at ${time}`);
		});
	});

	it('should set title as template', () => {
		component.isTemplateMode = true;

		component.ngAfterContentChecked();

		expect(component.pageTitle).toBe('Add a new template');
	});

	it('should set title as edit template', () => {
		component.isTemplateMode = true;
		component.disruptionForm.patchValue({ id: '23' });

		component.ngAfterContentChecked();

		expect(component.pageTitle).toBe('Edit a template');
	});

	it('should should set form state on save', () => {
		spyOn(editDisruptionService, 'setSubmittedStatus');

		component.onSave();

		expect(editDisruptionService.setSubmittedStatus).toHaveBeenCalledWith(IFormSubmittedState.Draft);
	});

	it('should open modal on submit', () => {
		// set form as valid
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set'
		});

		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.onSubmit();

		expect(modalService.get).toHaveBeenCalledWith('submit-modal');
		expect(mockModal.open).toHaveBeenCalled();
	});

	it('should set form status as publish on submit', () => {
		// set form as valid
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set'
		});

		spyOn(modalService, 'get').and.returnValue(mockModal);
		spyOn(editDisruptionService, 'setSubmittedStatus');

		component.onSubmit();

		expect(editDisruptionService.setSubmittedStatus).toHaveBeenCalledWith(IFormSubmittedState.Publish);
	});

	it('should set errors when form invalid on submit', () => {
		component.ngOnInit();
		component.disruptionForm.setErrors({ required: true });

		component.onSubmit();

		spyOn(modalService, 'get').and.returnValue(mockModal);
		spyOn(editDisruptionService, 'setSubmittedStatus');

		expect(component.disruptionForm.errors).toBeTruthy();

		expect(editDisruptionService.setSubmittedStatus).toHaveBeenCalledTimes(0);
		expect(modalService.get).toHaveBeenCalledTimes(0);
		expect(mockModal.open).toHaveBeenCalledTimes(0);
	});

	it('should close modal on submit', () => {
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.closeModal();

		expect(modalService.get).toHaveBeenCalledWith('submit-modal');
		expect(mockModal.close).toHaveBeenCalled();
	});

	it('formSubmittedForDraftOrPublish should be true when form has been saved', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Saved });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);

		component.ngOnInit();

		formStatus$.subscribe(s => {
			expect(component.formSubmittedForDraftOrPublish).toBeTruthy();
		});
	});

	it('formSubmittedForDraftOrPublish should be false when form has is pending', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Pending });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);

		component.ngOnInit();

		expect(component.formSubmittedForDraftOrPublish).toBeFalsy();
	});

	it('formDraftSubmitted should be false until submitted', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Draft });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);

		component.ngOnInit();

		formStatus$.subscribe(s => {
			expect(component.formDraftSubmbitted).toBeFalsy();
		});
	});

	it('formDraftSubmitted should be true after submit', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Submitted });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);

		component.ngOnInit();

		formStatus$.subscribe(s => {
			expect(component.formDraftSubmbitted).toBeTruthy();
		});
	});

	it('should submit form', () => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set',
			description: 'description is set'
		});
		spyOn(editDisruptionService, 'submitForPublication');
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.submitModal();

		expect(editDisruptionService.submitForPublication).toHaveBeenCalled();
		expect(mockModal.close).toHaveBeenCalled();
	});

	it('onNavigate should set the active tab', () => {
		const tabIdx = 1;
		spyOnProperty(tabService, 'tabs').and.returnValue(['Overview', 'Impacts', 'Messaging']);
		spyOn(tabService, 'setActive');

		component.ngOnInit();

		component.onNavigate(tabIdx);

		expect(tabService.setActive).toHaveBeenCalledWith('Impacts');
	});

	it('return true when errors submitting the form', () => {
		const formStatus$ = cold('-a|', { a: IFormSubmittedState.Draft });
		spyOnProperty(editDisruptionService, 'formSubmitStatus$').and.returnValue(formStatus$);

		component.ngOnInit();
		component.disruptionForm.get('overviewGroup').setErrors({ errors: { summary: { required: true } } });

		component.onSave();
		formStatus$.subscribe(s => {
			expect(component.errorSubmittingDraft).toBeTruthy();
		});
	});

	it('should not save draft with profane summary', () => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});

		component.disruptionForm.get('overviewGroup').patchValue({
			summary: 'summary is set'
		});
		component.disruptionForm.get('overviewGroup').setErrors({ errors: { summary: { profanity: true } } });

		spyOn(editDisruptionService, 'saveDisruption');

		component.onSave();

		expect(editDisruptionService.saveDisruption).toHaveBeenCalledTimes(0);
	});

	it('should not save draft with profane overview', fakeAsync(() => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const summary = fixture.debugElement.query(By.css('#disruption-summary'));
		summary.nativeElement.value = 'Assface';
		summary.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();

		spyOn(editDisruptionService, 'saveDisruption');
		component.onSave();

		summary.nativeElement.value = 'fixed';
		summary.nativeElement.dispatchEvent(new Event('input'));

		const desc = fixture.debugElement.query(By.css('#disruption-description'));
		desc.nativeElement.value = 'Assface';
		desc.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		component.onSave();
		expect(editDisruptionService.saveDisruption).toHaveBeenCalledTimes(0);

		desc.nativeElement.value = 'good';
		desc.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		component.onSave();
		expect(editDisruptionService.saveDisruption).toHaveBeenCalledTimes(1);
	}));

	it('should not save draft with profane messaging', fakeAsync(() => {
		component.disruptionForm = formBuilder.group({
			id: new FormControl(''),
			submitComment: new FormControl(''),
			overviewGroup: [],
			impactGroup: [[]],
			messagingGroup: []
		});
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const summary = fixture.debugElement.query(By.css('#disruption-summary'));
		summary.nativeElement.value = 'summary';
		summary.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		const message = fixture.debugElement.query(By.css('#message-text-0'));
		message.nativeElement.value = 'Assface';
		message.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		spyOn(editDisruptionService, 'saveDisruption');
		component.onSave();

		message.nativeElement.value = 'fixed';
		message.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		flushTickAndDetectChanges(fixture);
		component.onSave();
		expect(editDisruptionService.saveDisruption).toHaveBeenCalledTimes(1);
	}));
});
