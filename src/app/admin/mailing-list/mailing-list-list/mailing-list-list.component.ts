import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { MailingListService } from '../mailing-list.service';

@Component({
	selector: 'dm-mailing-list-list',
	templateUrl: './mailing-list-list.component.html',
	styleUrls: ['./mailing-list-list.component.scss']
})
export class MailingListListComponent implements OnInit {
	mailingListEntries$: Observable<MailingListViewmodel[]>;

	columnDefs = [
		{headerName: 'Email', field: 'email'},
		{headerName: 'Severity', field: 'severityDisplay'},
		{headerName: 'Opted In', field: 'optedIn'},
		{headerName: 'Organisation', field: 'organisation.name' }
	];

	constructor(public mailingListService: MailingListService) {
	}

	ngOnInit() {
		this.mailingListEntries$ = this.mailingListService.list();
	}

	onEdit(entry: MailingListViewmodel) {
		this.mailingListService.editEntry(entry);
	}

	onDelete(entry: MailingListViewmodel) {
		this.mailingListService.deleteEntry(entry);
	}

}
