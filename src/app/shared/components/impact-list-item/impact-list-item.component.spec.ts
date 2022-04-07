import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactListItemComponent } from './impact-list-item.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';

describe('ImpactListItemComponent', () => {
	let component: ImpactListItemComponent;
	let fixture: ComponentFixture<ImpactListItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactListItemComponent],
			imports: [AngularSvgIconModule, HttpClientModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactListItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	xit('should create', () => {
		expect(component).toBeTruthy();
	});
});
