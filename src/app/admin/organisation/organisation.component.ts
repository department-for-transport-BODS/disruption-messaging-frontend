import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrganisationService} from './organisation.service';

@Component({
	selector: 'dm-organisation',
	templateUrl: './organisation.component.html',
	styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit, OnDestroy {

	constructor(
		public orgService: OrganisationService,
	) {}

	ngOnInit() {}

	ngOnDestroy(): void {}
}
