import { Component, OnInit } from '@angular/core';
import { MailingListService } from '../mailing-list.service';

@Component({
	selector: 'dm-mailing-list',
	templateUrl: './mailing-list.component.html',
	styleUrls: ['./mailing-list.component.scss']
})
export class MailingListComponent implements OnInit {

	constructor(public service: MailingListService) {
	}

	ngOnInit() {
	}

}
