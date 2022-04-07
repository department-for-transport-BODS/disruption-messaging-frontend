import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
import { SettingsService } from './settings.service';
import * as moment from 'moment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EnumValueViewModel, UserUsageInformationViewModel } from './settings.viewmodel';
import { AngularCsv, Options } from 'angular7-csv/dist/Angular-csv';
import { DateFormatter } from '../shared/formatters/date.formatter';

@Component({
	selector: 'dm-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	constructor(private settingsService: SettingsService) {}

	enumValues: EnumValueViewModel[] = [];
	options: Options;
	csvHeaders = ['id', 'User Name', 'User Email', 'Organisation', 'User Type', 'Last Login (all time)',
	'Disruptions Entered (time period selected)', 'Disruptions Approved (time period selected)'];
	startDate: moment.Moment;
	endDate: moment.Moment;

	ngOnInit() {
		this.settingsService.enumValueViewModelList().subscribe(enums => {
			this.enumValues = enums;
		});

		this.options = {
			fieldSeparator: ',',
			quoteStrings: '"',
			decimalseparator: '.',
			showLabels: false,
			headers: [],
			showTitle: false,
			useBom: false,
			filename: 'user_information',
			title: '',
			noDownload: false
		};
		this.startDate = null;
		this.endDate = null;
	}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
	}

	onSave() {
		this.settingsService.clearResponse();
		this.settingsService.setEnumValues(this.enumValues);
	}

	get service() {
		return this.settingsService;
	}

	genCSV() {
		const fromDate = this.startDate ? this.startDate.toISOString() : null;
		const toDate = this.endDate ? this.endDate.toISOString() : null;
		this.settingsService.userUsageInformationViewModelList(fromDate, toDate).take(1).subscribe(users => {
			const csvData = users;
			this.options.headers = this.csvHeaders;
			return new AngularCsv(csvData, this.options.filename, this.options);
		});
		return;
	}
}
