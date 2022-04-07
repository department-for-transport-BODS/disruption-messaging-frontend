import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconButtonComponent } from './icon-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

describe('IconButtonComponent', () => {
	let component: IconButtonComponent;
	let fixture: ComponentFixture<IconButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IconButtonComponent],
			imports: [AngularSvgIconModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IconButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
