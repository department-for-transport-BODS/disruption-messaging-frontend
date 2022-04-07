import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VersionComponent} from './version.component';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {RouterTestingModule} from '@angular/router/testing';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('VersionComponent', () => {
	let component: VersionComponent;
	let fixture: ComponentFixture<VersionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AngularSvgIconModule,
				RouterTestingModule,
				ApolloTestingModule,
				HttpClientTestingModule,
			],
			declarations: [VersionComponent]
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VersionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
