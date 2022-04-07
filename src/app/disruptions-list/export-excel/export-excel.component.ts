import { Component, OnInit, Input } from '@angular/core';
import { ExportService } from '../export.service';
import { utils, writeFile, WorkBook } from 'xlsx';
import { ExportAllFieldsService } from '../export-all-fields.service';

@Component({
	selector: 'dm-export-excel',
	templateUrl: './export-excel.component.html',
	styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent implements OnInit {
	@Input()  exportAllExcel: boolean;

	constructor(private exportService: ExportService, private exportAllFieldsService: ExportAllFieldsService) { }

	ngOnInit() { }

	genExcel() {
		const workBook = utils.book_new();
		let excelData = null;
		let fileName = 'disruptions_list.xlsx';
		if (this.exportAllExcel) {
			excelData = this.exportAllFieldsService.fillData();
			fileName = 'disruptions_all_fields.xlsx';
		} else {
			excelData = this.exportService.data;
		}
		const worksheet = utils.json_to_sheet(excelData);
		utils.book_append_sheet(workBook, worksheet);
		writeFile(workBook, fileName);
	}
}
