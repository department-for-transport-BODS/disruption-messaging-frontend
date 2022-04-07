import { OverviewComponent } from './overview.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDisruptionService } from '../edit-disruption.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AutocompleteDisruptionsService } from './autocomplete-disruptions/autocomplete-disruptions.service';
import * as moment from 'moment';
import { IEditValidityPeriodViewModel } from '../edit-disruption.view.model';
import { By } from '@angular/platform-browser';
import { IFormSubmittedState } from '../../../shared/forms/FormStateEnum';

describe('Validity period validation', () => {
	let component: OverviewComponent;
	let fixture: ComponentFixture<OverviewComponent>;
	let service: EditDisruptionService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OverviewComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				ApolloTestingModule,
				RouterTestingModule,
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				HttpClientTestingModule
			],
			providers: [EditDisruptionService, AutocompleteDisruptionsService]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		service = TestBed.get(EditDisruptionService);
		fixture = TestBed.createComponent(OverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	const checkError = (message) => {
		const formErrors = fixture.debugElement.query(By.css('.form__feedback--error'));
		expect(formErrors).toBeTruthy();
		expect(formErrors.nativeElement.innerText).toBe(message);
	};

	it('should validate correct validity period', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment()
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();

	});

	it('should validate incorrect validity range', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().subtract(7, 'days')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidDates: true});

		checkError('The start date must be before the end date.');
	});

	xit('should validate required start date - cannot get group to be dirty at the right time.', () => {
		const vp: IEditValidityPeriodViewModel = {
			endDate: moment()
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		component.validityPeriodsArr.markAsDirty();
		component.submitStatus = IFormSubmittedState.Draft;

		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({start_required: true});
		checkError('Start date is required.');
	});

	it('should validate required end date', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment()
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		component.submitStatus = IFormSubmittedState.Draft;
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({end_required: true});
		checkError('End date is required.');
	});

	it('should allow valid daily repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment(),
			repeats: 'Daily',
			ending: moment()
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow repeating without final date.', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(12, 'hours'),
			repeats: 'Daily'
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({ending_required: true});
	});

	it('should disallow invalid daily repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(25, 'hours'),
			repeats: 'Daily',
			ending: moment().add(1, 'days')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidRangeDaily: true});
		checkError('The date range must be within 24 hours for daily repetitions.');
	});

	it('should allow valid weekly repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(5, 'days'),
			repeats: 'Weekly',
			ending: moment().add(1, 'month')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow invalid weekly repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment('2020-02-29', 'YYYY-MM-DD'),
			endDate: moment('2020-02-29', 'YYYY-MM-DD').add(7, 'days'),
			repeats: 'Weekly',
			ending: moment('2020-02-29', 'YYYY-MM-DD').add(1, 'month')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidRangeWeekly: true});
		checkError('The date range must be within 7 days for weekly repetitions.');
	});

	it('should allow valid repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment(),
			repeats: 'Daily',
			ending: moment().add(1, 'week')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow invalid repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(5, 'days'),
			repeats: 'Weekly',
			ending: moment().add(1, 'day')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidEnding: true});
		checkError('The final date must be after the end date of validity period.');
	});
});


describe('Validity period validation for open-ended disruptions', () => {
	let component: OverviewComponent;
	let fixture: ComponentFixture<OverviewComponent>;
	let service: EditDisruptionService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OverviewComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				ApolloTestingModule,
				RouterTestingModule,
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				HttpClientTestingModule
			],
			providers: [EditDisruptionService, AutocompleteDisruptionsService]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		service = TestBed.get(EditDisruptionService);
		fixture = TestBed.createComponent(OverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	const checkError = (message) => {
		const formErrors = fixture.debugElement.query(By.css('.form__feedback--error'));
		expect(formErrors).toBeTruthy();
		expect(formErrors.nativeElement.innerText).toBe(message);
	};

	it('should allow date range without end date', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();

	});

	it('should allow open-ended repeating date range without final date.', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment(),
			repeats: 'Daily',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow repeating without end date.', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			repeats: 'Daily',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		component.submitStatus = IFormSubmittedState.Draft;
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({end_required: true});
		checkError('End date is required.');
	});

	it('should allow correct daily repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment(),
			repeats: 'Daily',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow incorrect daily repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(2, 'days'),
			repeats: 'Daily',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidRangeDaily: true});
		checkError('The date range must be within 24 hours for daily repetitions.');
	});

	it('should allow correct weekly repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(6, 'days'),
			repeats: 'Weekly',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeTruthy();
		expect(component.validityPeriodsArr.controls[0].errors).toBeNull();
	});

	it('should disallow incorrect weekly repeating', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(8, 'days'),
			repeats: 'Weekly',
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();

		expect(component.validityPeriodsArr.valid).toBeFalsy();
		expect(component.validityPeriodsArr.controls[0].errors).toEqual({invalidRangeWeekly: true});
		checkError('The date range must be within 7 days for weekly repetitions.');
	});

	it('should disallow multiple when open-ended', () => {
		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(8, 'days'),
		};
		const vp2: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(8, 'days'),
		};
		component.overview.get('isOpenEnded').setValue(true);
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		component.addValidityPeriod(vp2);
		fixture.detectChanges();

		expect(component.overview.valid).toBeFalsy();
		expect(component.overview.errors).toEqual({openEndedMulti: true});
		checkError('Only one validity period is allowed for open ended disruptions.');
	});
});

describe('Publishing period validation', () => {
	let component: OverviewComponent;
	let fixture: ComponentFixture<OverviewComponent>;
	let service: EditDisruptionService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OverviewComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				ApolloTestingModule,
				RouterTestingModule,
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				HttpClientTestingModule
			],
			providers: [EditDisruptionService, AutocompleteDisruptionsService]
		}).compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(EditDisruptionService);
		fixture = TestBed.createComponent(OverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		const vp: IEditValidityPeriodViewModel = {
			startDate: moment(),
			endDate: moment().add(1, 'day')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);
		fixture.detectChanges();
	});

	const checkError = (message) => {
		const formErrors = fixture.debugElement.query(By.css('.form__feedback--error'));
		expect(formErrors).toBeTruthy();
		expect(formErrors.nativeElement.innerText).toBe(message);
	};

	it('should allow valid publishing range.', () => {
		component.overview.get('publishingStart').setValue(moment().subtract(1, 'day'));
		component.overview.get('publishingEnd').setValue(moment().add(2, 'days'));

		fixture.detectChanges();

		expect(component.overview.errors).toBeNull();
	});

	it('should validate invalid publishing date range.', () => {
		component.overview.get('publishingStart').setValue(moment().subtract(1, 'day'));
		component.overview.get('publishingEnd').setValue(moment().subtract(2, 'days'));

		fixture.detectChanges();

		expect(component.overview.valid).toBeFalsy();
		expect(component.overview.errors).toEqual({publishingRange: true});
		checkError('The start date must be before the end date.');
	});

	it('should disallow if publishingStart is later than validity start', () => {
		component.overview.get('publishingStart').setValue(moment());
		component.overview.get('publishingEnd').setValue(moment());

		fixture.detectChanges();

		expect(component.overview.valid).toBeFalsy();
		expect(component.overview.errors).toEqual({validityPeriodBeforeStart: true});
		checkError('The publishing period must start before the first validity period.');
	});

	it('should disallow if publishingStart is later than validity start (multi)', () => {
		component.overview.get('publishingStart').setValue(moment().subtract(4, 'days'));
		component.overview.get('publishingEnd').setValue(moment().add(4, 'days'));

		fixture.detectChanges();

		expect(component.overview.errors).toBeNull();

		const vp: IEditValidityPeriodViewModel = {
			startDate: moment().subtract(5, 'days'),
			endDate: moment().add(5, 'days')
		};
		component.validityPeriodsArr.clear();
		component.addValidityPeriod(vp);

		fixture.detectChanges();
		expect(component.overview.valid).toBeFalsy();
		expect(component.overview.errors).toEqual({validityPeriodBeforeStart: true});
		checkError('The publishing period must start before the first validity period.');
	});

	it('should disallow if publishingEnd is earlier than validity end', () => {
		component.overview.get('publishingStart').setValue(moment().subtract(1, 'day'));
		component.overview.get('publishingEnd').setValue(moment());

		fixture.detectChanges();

		expect(component.overview.valid).toBeFalsy();
		expect(component.overview.errors).toEqual({validityPeriodAfterEnd: true});
		checkError('The publishing period must end after the last validity period.');

	});
});
