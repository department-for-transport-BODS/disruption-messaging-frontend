import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { ImpactsListComponent } from './impacts-list.component';
import { ImpactComponent } from '../impact/impact.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { EditDisruptionService } from '../edit-disruption.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImpactMapComponent } from '../impact-map/impact-map.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {environment} from '../../../../environments/environment';
import {NgxSpinnerModule} from 'ngx-spinner';

describe('ImpactsListComponent', () => {
	let component: ImpactsListComponent;
	let fixture: ComponentFixture<ImpactsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactsListComponent, ImpactComponent, ImpactMapComponent],
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				NgxDaterangepickerMd.forRoot(),
				ApolloTestingModule,
				RouterTestingModule,
				AngularSvgIconModule,
				HttpClientTestingModule,
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				NgxSpinnerModule
			],
			providers: [EditDisruptionService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
