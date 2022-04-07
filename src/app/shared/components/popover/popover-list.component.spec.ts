import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { PopoverListComponent } from './popover-list.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { Key } from 'selenium-webdriver';

describe('PopoverListComponent', () => {
	let component: PopoverListComponent;
	let fixture: ComponentFixture<PopoverListComponent>;
	let inputEl: HTMLElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PopoverListComponent],
			imports: [AngularSvgIconModule, RouterTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PopoverListComponent);
		component = fixture.componentInstance;
		component.popoverList = ['a', 'b', 'c', 'd', 'e'];
		component.index = 0;
		fixture.detectChanges();

		inputEl = fixture.nativeElement.querySelectorAll('span');
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set show on init', () => {
		component.show = true;
		component.ngOnInit();

		expect(component.show).toBe(true);
	});

	it('should return first element on click', () => {
		inputEl = fixture.nativeElement.querySelectorAll('span');
		fixture.detectChanges();
		spyOn(component.userSelectedEvent, 'emit');
		component.show = true;
		component.ngOnInit();

		inputEl[0].click();

		fixture.detectChanges();

		expect(component.selectedItem).toBe('a');
		expect(component.show).toBe(false);

		expect(component.userSelectedEvent.emit).toHaveBeenCalledWith({index: component.index, item: component.selectedItem});
	});

	it('should return fifth element on click', () => {
		inputEl = fixture.nativeElement.querySelectorAll('span');
		fixture.detectChanges();
		spyOn(component.userSelectedEvent, 'emit');
		component.show = true;
		component.ngOnInit();

		inputEl[4].click();

		fixture.detectChanges();

		expect(component.selectedItem).toBe('e');
		expect(component.show).toBe(false);

		expect(component.userSelectedEvent.emit).toHaveBeenCalledWith({index: component.index, item: component.selectedItem});
	});
});
