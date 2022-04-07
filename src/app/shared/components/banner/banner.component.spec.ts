import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BannerComponent', () => {
	let component: BannerComponent;
	let fixture: ComponentFixture<BannerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BannerComponent],
			imports: [AngularSvgIconModule, HttpClientTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BannerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		expect(component.icon).toBe('check-circle');
		expect(component.bannerClasses).toBe('banner');
	});

	it('should set props on error', () => {
		component.appearance = 'error';

		component.ngOnInit();

		expect(component.bannerClasses).toEqual('banner banner--error');
		expect(component.icon).toEqual('stop');
	});

	it('should set props on success', () => {
		component.appearance = 'success';

		component.ngOnInit();

		expect(component.bannerClasses).toEqual('banner banner--success');
		expect(component.icon).toEqual('check-circle');
	});
});
