import { Component, OnInit, OnDestroy, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDisruptionService } from './view-disruption.service';
import { ViewDisruptionViewModel } from './view-disruption.viewmodel';
import { Subscription } from 'rxjs';
import { EditDisruptionService } from '../edit/edit-disruption.service';

@Component({
	selector: 'dm-view-disruption',
	templateUrl: './view-disruption.component.html',
	styleUrls: ['./view-disruption.component.scss']
})
export class ViewDisruptionComponent implements OnInit, OnDestroy, AfterContentChecked {
	private disruptionSubscription: Subscription;
	private urlSubscription: Subscription;
	private errorSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private viewDisruptionService: ViewDisruptionService,
		private editService: EditDisruptionService
	) {}

	id: number;
	disruption: ViewDisruptionViewModel;
	pageTitle: string;
	errors: any;
	showSpinner = false;

	ngOnInit(): void {
		this.id = parseInt(this.route.snapshot.paramMap.get('id'), 0);
		this.showSpinner = true;
		this.disruptionSubscription = this.viewDisruptionService.currentDisruption$.subscribe(dis => {
			this.errors = null;
			this.disruption = dis;
			if (dis) {
				this.showSpinner = false;
			}
		});

		this.errorSubscription = this.viewDisruptionService.errors$.subscribe(s => {
			this.showSpinner = false;
			this.errors = s;
		});

		this.urlSubscription = this.route.url.subscribe(url => {
			if (url) {
				const newId = parseInt(url.reverse()[0].path, 0);
				if (!isNaN(newId)) {
					this.id = newId;
					this.viewDisruptionService.setCurrentDisruption(newId);
				}
			}
		});
	}

	ngOnDestroy() {
		if (this.disruptionSubscription) {
			this.viewDisruptionService.clearCurrentDisruption();
			this.disruptionSubscription.unsubscribe();
		}
		if (this.urlSubscription) {
			this.urlSubscription.unsubscribe();
		}
		if (this.errorSubscription) {
			this.errorSubscription.unsubscribe();
		}
	}

	ngAfterContentChecked() {
		this.setTitle();
	}

	get duplicateText() {
		return this.disruption && this.disruption.isTemplate ? 'Create from' : 'Duplicate';
	}

	onDuplicate() {
		this.editService.setCurrentDisruption(this.id, true);
		this.router.navigate(['disruption/edit']);
	}

	impactTabTitle() {
		return 'Impacts' + (this.disruption.impacts.length > 0 ? ' (' + this.disruption.impacts.length + ')' : '');
	}

	messageTabTitle() {
		return (
			'Messages' +
			(this.disruption.socialMessages.length > 0 ? ' (' + this.disruption.socialMessages.length + ')' : '')
		);
	}

	private setTitle() {
		this.pageTitle =
			this.disruption && this.disruption.isTemplate
				? `Template ${this.disruption.id}`
				: `Disruption ${this.disruption && this.disruption.id}`;
	}

	get title(): string {
		return this.pageTitle;
	}

	get deleteRedirectUrl() {
		return this.disruption && this.disruption.isTemplate ? 'disruptions/templates' : 'disruptions';
	}
}
