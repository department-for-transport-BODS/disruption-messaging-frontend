import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OrganisationService } from '../../organisation/organisation.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { MailingListService } from '../mailing-list.service';

@Component({
	selector: 'dm-mailing-list-delete',
	templateUrl: './mailing-list-delete.component.html',
	styleUrls: ['./mailing-list-delete.component.scss']
})
export class MailingListDeleteComponent implements OnInit, OnDestroy {

	subscription: Subscription;
	entry: MailingListViewmodel;
	success = false;

	constructor(
		public service: MailingListService,
		private modalService: NgxSmartModalService) {
	}

	ngOnInit() {
		this.subscription = this.service.selectForDelete$().subscribe(
			(entry) => {
				this.entry = entry;
				if (this.entry) {
					this.modalService.getModal('mlDeleteModal').open();
				}
			}
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	confirmDelete() {
		this.service.delete(this.entry.id);
		this.entry = null;
	}

}
