import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';
import { EditDisruptionComponent } from './edit-disruption.component';
import { OverviewComponent } from './overview/overview.component';
import { MessagingComponent } from './messaging/messaging.component';
import { RouterModule } from '@angular/router';
import { ImpactComponent } from './impact/impact.component';
import { ImpactsListComponent } from './impacts-list/impacts-list.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { EditDisruptionService } from './edit-disruption.service';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImpactMapComponent } from './impact-map/impact-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../../../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
	parseInput: 'DD MMM YYYY HH:mm',
	fullPickerInput: 'DD MMM YYYY HH:mm',
	datePickerInput: 'DD MMM YYYY',
	timePickerInput: 'LT',
	monthYearLabel: 'MMM YYYY',
	dateA11yLabel: 'LL',
	monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
	declarations: [
		EditDisruptionComponent,
		OverviewComponent,
		MessagingComponent,
		ImpactComponent,
		ImpactsListComponent,
		ImpactMapComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		NgSelectModule,
		ReactiveFormsModule,
		RouterModule,
		NgxSmartModalModule,
		BrowserModule,
		BrowserAnimationsModule,
		OwlDateTimeModule,
		OwlMomentDateTimeModule,
		NgxMapboxGLModule.withConfig({
			accessToken: environment.mapbox.accessToken
		}),
		NgxSpinnerModule,
		NgSelectModule
	],
	exports: [EditDisruptionComponent],
	providers: [EditDisruptionService, { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }]
})
export class EditDisruptionModule {}
