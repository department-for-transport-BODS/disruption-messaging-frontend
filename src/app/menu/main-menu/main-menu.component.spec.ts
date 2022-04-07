import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuComponent } from './main-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MainMenuComponent', () => {
	let component: MainMenuComponent;
	let fixture: ComponentFixture<MainMenuComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AngularSvgIconModule, RouterTestingModule, HttpClientTestingModule],
			declarations: [MainMenuComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MainMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
