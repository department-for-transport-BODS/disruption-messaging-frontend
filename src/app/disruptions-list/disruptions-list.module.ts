import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { DisruptionPreviewComponent } from './preview/disruption-preview.component';
import { DisruptionsListComponent } from './disruptions-list.component';
import { DisruptionsGridComponent } from './grid/disruptions-grid.component';
import { DisruptionsFilterComponent } from './filter/disruptions-filter.component';
import { AutocompleteLinesComponent } from './filter/autocomplete-lines/autocomplete-lines.component';

import { DeleteDisruptionModule } from '../disruption/delete/delete-disruption.module';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LiveIndicatorParentComponent } from './grid/live-indicator.parent.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ExportCsvComponent } from './export-csv/export-csv.component';
import { ExportExcelComponent } from './export-excel/export-excel.component';
import { ExportPdfComponent } from './export-pdf/export-pdf.component';

@NgModule({
	declarations: [
		DisruptionsListComponent,
		DisruptionsGridComponent,
		DisruptionPreviewComponent,
		AutocompleteLinesComponent,
		DisruptionsFilterComponent,
		LiveIndicatorParentComponent,
		ExportCsvComponent,
		ExportExcelComponent,
		ExportPdfComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		SharedModule,
		DeleteDisruptionModule,
		NgxDaterangepickerMd.forRoot(),
		AgGridModule.withComponents([LiveIndicatorParentComponent]),
		NgSelectModule,
		RouterModule,
		NgxSpinnerModule
	]
})
export class DisruptionsListModule {}
