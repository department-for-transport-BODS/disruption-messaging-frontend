import {Component, OnInit} from '@angular/core';
import {OrganisationService} from '../organisation.service';
import {Observable} from 'rxjs';
import {OrganisationViewModel} from '../organisation.viewmodel';

@Component({
	selector: 'dm-org-list',
	templateUrl: './org-list.component.html',
	styleUrls: ['./org-list.component.scss']
})
export class OrgListComponent implements OnInit {
	organisations$: Observable<OrganisationViewModel[]>;

	columnDefs = [
		{headerName: 'Name', field: 'name'},
		{headerName: 'URL', field: 'url'},
		{headerName: 'Admin areas', field: 'adminAreasString'}
	];

	constructor(
		public orgService: OrganisationService,
	) {}

	ngOnInit() {
		this.organisations$ = this.orgService.list();
	}

	onEdit(organisation) {
		this.orgService.editOrganisation(organisation);
	}

	onDelete(organisation) {
		this.orgService.deleteOrganisation(organisation);
	}
}
