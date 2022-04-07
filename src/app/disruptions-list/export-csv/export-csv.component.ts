import { Component, OnInit, Input } from '@angular/core';
import { ExportService } from '../export.service';
import { AngularCsv, Options } from 'angular7-csv/dist/Angular-csv';
import { ExportAllFieldsService } from '../export-all-fields.service';

@Component({
	selector: 'dm-export-csv',
	templateUrl: './export-csv.component.html',
	styleUrls: ['./export-csv.component.scss']
})
export class ExportCsvComponent implements OnInit {
	options: Options;
	@Input()  exportAllCsv: boolean;

	constructor(private exportService: ExportService, private exportAllFieldsService: ExportAllFieldsService) { }

	ngOnInit() {
		this.options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalseparator: '.',
			showLabels: false,
			headers: [],
			showTitle: false,
			useBom: false,
			filename: 'disruptions_list',
			title: '',
			noDownload: false
		};
	}

	genCSV() {
		let csvData = null;
		let fileName = 'disruptions_list';
		if (this.exportAllCsv) {
			csvData = this.exportAllFieldsService.fillData();
			fileName = 'disruptions_all_fields';
		} else {
			csvData = this.exportService.data;
		}
		this.options.headers = Object.keys(csvData[0]);
		return new AngularCsv(csvData, fileName, this.options);
	}
}
