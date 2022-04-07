import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { cold } from 'jasmine-marbles';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDisruptionService } from '../edit-disruption.service';
import { AutocompleteDisruptionsService } from './autocomplete-disruptions/autocomplete-disruptions.service';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import * as moment from 'moment';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import {By} from '@angular/platform-browser';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('OverviewComponent', () => {
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

	it('should create', () => {
		const obs$ = cold('a|', { a: null });
		spyOnProperty(service, 'currentDisruption$').and.returnValue(obs$);
		spyOnProperty(service, 'formSubmitStatus$').and.returnValue(obs$);

		expect(component).toBeTruthy();
	});

	it('should validate description for Profanity.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const desc = fixture.debugElement.query(By.css('#disruption-description'));
		// Apologies for profanity, but this is a profanity test.
		desc.nativeElement.value = 'Assface';
		desc.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Please refrain from using profane words in text.');
	}));

	it('should validate summary for Profanity.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const summary = fixture.debugElement.query(By.css('#disruption-summary'));
		// Apologies for profanity, but this is a profanity test.
		summary.nativeElement.value = 'Assface';
		summary.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Please refrain from using profane words in text.');
	}));

	it('should validate description for non-ascii.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const desc = fixture.debugElement.query(By.css('#disruption-description'));
		desc.nativeElement.value = 'This is a description with non-ascii É character';
		desc.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Non-printable character É is not allowed.');
	}));

	it('should validate summary for non-ascii.', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		const desc = fixture.debugElement.query(By.css('#disruption-summary'));
		desc.nativeElement.value = 'This is a summary with non-ascii É character';
		desc.nativeElement.dispatchEvent(new Event('input'));

		tick(500);
		fixture.detectChanges();
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Non-printable character É is not allowed.');
	}));

	it('populate validity description for daily repetition', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		component.overview.get('validityPeriods').patchValue([{startDate: moment('2019-10-31T10:10:00'), endDate: moment('2019-10-31T12:10:00'),
		repeats: 'Daily', ending: moment('2019-11-01')}]);
		tick(500);
		fixture.detectChanges();

		expect(component.overview.get('validityPeriods').value[0].description).toBe('The validity period ends on 01 Nov 2019 at 12:10');
	}));

	it('populate validity description for weekly repetition wth same ending and endDate', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		component.overview.get('validityPeriods').patchValue([{startDate: moment('2019-10-31T10:10:00'), endDate: moment('2019-11-01T12:10:00'),
		repeats: 'Weekly', ending: moment('2019-11-15')}]);
		tick(500);
		fixture.detectChanges();

		expect(component.overview.get('validityPeriods').value[0].description).toBe('The validity period ends on 15 Nov 2019 at 12:10');
	}));

	it('populate validity description for weekly repetition wth same ending and startDate', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		component.overview.get('validityPeriods').patchValue([{startDate: moment('2019-10-30T10:10:00'), endDate: moment('2019-11-01T12:10:00'),
		repeats: 'Weekly', ending: moment('2019-11-13')}]);
		tick(500);
		fixture.detectChanges();

		expect(component.overview.get('validityPeriods').value[0].description).toBe('The validity period ends on 13 Nov 2019 at 12:10');
	}));

	it('populate validity description for weekly repetition wth ending after endDate', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		component.overview.get('validityPeriods').patchValue([{startDate: moment('2019-10-31T10:10:00'), endDate: moment('2019-11-01T12:10:00'),
		repeats: 'Weekly', ending: moment('2019-11-12')}]);
		tick(500);
		fixture.detectChanges();

		expect(component.overview.get('validityPeriods').value[0].description).toBe('The validity period ends on 08 Nov 2019 at 12:10');
	}));

	it('populate validity description for weekly repetition wth ending between startDate and endDate', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		component.overview.get('validityPeriods').patchValue([{startDate: moment('2019-10-31T10:10:00'), endDate: moment('2019-11-02T12:10:00'),
		repeats: 'Weekly', ending: moment('2019-11-15')}]);
		tick(500);
		fixture.detectChanges();

		expect(component.overview.get('validityPeriods').value[0].description).toBe('The validity period ends on 15 Nov 2019 at 23:59');
	}));
});
