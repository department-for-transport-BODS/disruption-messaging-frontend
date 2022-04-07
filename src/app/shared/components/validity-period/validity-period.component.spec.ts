import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidityPeriodComponent } from './validity-period.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

describe('ValidityPeriodComponent', () => {
	let component: ValidityPeriodComponent;
	let fixture: ComponentFixture<ValidityPeriodComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ValidityPeriodComponent],
			imports: [AngularSvgIconModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ValidityPeriodComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
