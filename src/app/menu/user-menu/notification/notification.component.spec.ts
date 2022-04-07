import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationComponent} from './notification.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../../shared/shared.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {By} from '@angular/platform-browser';
import {Routes} from '@angular/router';

describe('NotificationComponent', () => {
	let component: NotificationComponent;
	let fixture: ComponentFixture<NotificationComponent>;
	const routes: Routes = [
		{path: 'disruption', redirectTo: ''},
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [NotificationComponent],
			imports: [
				RouterTestingModule,
				SharedModule,
				HttpClientTestingModule,
				ApolloTestingModule,
				RouterTestingModule.withRoutes(routes)
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display duplicates', () => {
		expect(component).toBeTruthy();
		component.duplicates = ['15'];
		fixture.detectChanges();
		const notifyDe = fixture.debugElement;
		const dupList = notifyDe.query(By.css('.notification__duplicate-item > li > a'));
		expect(dupList.nativeElement.innerHTML).toBe('Disruption #15');
		expect(dupList.properties.href).toBe('/disruption/15');
	});

	it('should display acknowledge button when there are duplicates', () => {
		expect(component).toBeTruthy();
		component.duplicates = ['15'];
		fixture.detectChanges();
		const notifyDe = fixture.debugElement;
		const ackButton = notifyDe.query(By.css('dm-button'));
		expect(ackButton).toBeTruthy('Ack button not displayed for duplicates');
	});

	it('should not display acknowledge button when there are no duplicates', () => {
		expect(component).toBeTruthy();
		component.duplicates = [];
		fixture.detectChanges();
		const notifyDe = fixture.debugElement;
		const ackButton = notifyDe.query(By.css('dm-button'));
		expect(ackButton).toBeFalsy('Ack button displayed for notifications without duplicates');
	});

	it('Clicking acknowledge should mark notification as read', () => {
		expect(component).toBeTruthy();
		component.duplicates = ['15'];
		const onClearSpy = spyOn(component.onClear, 'emit').and.stub();
		fixture.detectChanges();
		const notifyDe = fixture.debugElement;
		const ackButton = notifyDe.query(By.css('dm-button > button'));
		ackButton.nativeElement.click();
		expect(onClearSpy).toHaveBeenCalled();
	});

	it('No acknowledge button when status is Read', () => {
		expect(component).toBeTruthy();
		component.duplicates = ['15'];
		component.status = 'Read';
		const notifyDe = fixture.debugElement;
		const ackButton = notifyDe.query(By.css('dm-button'));
		expect(ackButton).toBeFalsy('Ack button displayed when status is Read');
	});
});
