import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrganisationService} from '../organisation.service';
import {Subscription} from 'rxjs';
import {NgxSmartModalService} from 'ngx-smart-modal';
import {OrganisationViewModel} from '../organisation.viewmodel';

@Component({
	selector: 'dm-org-delete',
	templateUrl: './org-delete.component.html',
	styleUrls: ['./org-delete.component.scss']
})
export class OrgDeleteComponent implements OnInit, OnDestroy {
	subscription: Subscription;
	organisation: OrganisationViewModel;
	success = false;

	constructor(
		public orgService: OrganisationService,
		private modalService: NgxSmartModalService) {
	}

	ngOnInit() {
		this.subscription = this.orgService.deletedOrganisation$.subscribe(
			(organisation) => {
				this.organisation = organisation;
				if (this.organisation) {
					this.modalService.getModal('deleteConfirmModal').open();
				}
			}
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	confirmDelete() {
		this.orgService.delete(this.organisation.id);
		this.organisation = null;
	}
}
