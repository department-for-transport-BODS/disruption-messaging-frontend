import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveIndicatorComponent } from './live-indicator.component';

describe('LiveIndicatorComponent', () => {
	let component: LiveIndicatorComponent;
	let fixture: ComponentFixture<LiveIndicatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LiveIndicatorComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LiveIndicatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	xit('should create', () => {
		expect(component).toBeTruthy();
	});
});
