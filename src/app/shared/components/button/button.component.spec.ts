import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('ButtonComponent', () => {
	let component: ButtonComponent;
	let fixture: ComponentFixture<ButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ButtonComponent],
			imports: [AngularSvgIconModule, RouterTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
