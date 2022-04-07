import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverComponent } from './popover.component';
import { PopoverService } from './popover.service';
import { ButtonComponent } from '../button/button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('PopoverComponent', () => {
	let component: PopoverComponent;
	let fixture: ComponentFixture<PopoverComponent>;
	let service: PopoverService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PopoverComponent, ButtonComponent],
			providers: [PopoverService],
			imports: [AngularSvgIconModule, RouterTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PopoverComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		service = TestBed.get(PopoverService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set id on init', () => {
		component.identifier = 'thisIdentifier';
		component.ngOnInit();

		expect(component.id).toBe('thisIdentifier');
	});

	it('should return open', () => {
		component.identifier = '1';
		spyOnProperty(service, 'popovers').and.returnValue(['1', '2', '3']);

		component.ngOnInit();

		expect(component.isOpen).toBeTruthy();
	});

	it('should toggle open to closed', () => {
		component.identifier = '1';
		spyOnProperty(service, 'popovers').and.returnValue(['1', '2', '3']);

		component.ngOnInit();
		component.toggleDropdown();

		expect(component.isOpen).toBeFalsy();
	});

	it('should return not open', () => {
		component.identifier = 'asdsadas';
		spyOnProperty(service, 'popovers').and.returnValue(['1', '2', '3']);

		component.ngOnInit();

		expect(component.isOpen).toBeFalsy();
	});

	it('should toggle open to true', () => {
		component.identifier = 'asdsadas';
		spyOnProperty(service, 'popovers').and.returnValue(['1', '2', '3']);

		component.ngOnInit();
		component.toggleDropdown();

		expect(component.isOpen).toBeTruthy();
	});
});
