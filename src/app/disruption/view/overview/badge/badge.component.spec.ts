import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { BadgeComponent } from './badge.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BadgeComponent', () => {
	let component: BadgeComponent;
	let fixture: ComponentFixture<BadgeComponent>;
	const mockRouter = jasmine.createSpyObj('router', ['navigate']);
	(mockRouter.navigate as jasmine.Spy).and.returnValue(Promise.resolve(true));

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BadgeComponent],
			imports: [RouterTestingModule],
			providers: [{ provide: Router, useValue: mockRouter }]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BadgeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set output classes with valid size', () => {
		component.size = 'sm';

		component.ngOnInit();

		expect(component.outputClasses).toEqual(['badge', 'badge--sm']);
		expect(component.badgeClasses).toEqual('badge badge--sm');
	});

	it('should set output classes without valid size', () => {
		component.size = 'smfdsfdsf';

		component.ngOnInit();

		expect(component.outputClasses).toEqual(['badge']);
		expect(component.badgeClasses).toEqual('badge');
	});

	it('should goto route on click', fakeAsync(() => {
		component.route = ['/test'];
		fixture.detectChanges();

		const link = fixture.nativeElement.querySelector('a');
		link.click();

		flush();

		expect(mockRouter.navigate).toHaveBeenCalledWith(['/test']);
	}));
});
