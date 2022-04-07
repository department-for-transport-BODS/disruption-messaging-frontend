import { Component, OnInit, OnDestroy } from '@angular/core';
import { DisruptionsListService } from '../disruptions-list.service';
import { DisruptionPreviewViewModel } from './disruption-preview.viewmodel';
import { Subscription } from 'rxjs';
import { AuditHistoryViewModel } from 'src/app/audit/audit-history.viewmodel';
import { AuditHistoryService } from 'src/app/audit/audit-history.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'dm-disruption-preview',
	templateUrl: './disruption-preview.component.html',
	styleUrls: ['./disruption-preview.component.scss']
})
export class DisruptionPreviewComponent implements OnInit, OnDestroy {
	constructor(
		private disruptionService: DisruptionsListService,
		private auditHistoryService: AuditHistoryService,
		private spinner: NgxSpinnerService
) {}

	disruption: DisruptionPreviewViewModel;
	history: AuditHistoryViewModel[];
	activeTab = 'Overview';

	private loadingSubscription: Subscription;
	private previewSubscription: Subscription;
	private historySubscription: Subscription;

	ngOnInit(): void {
		this.previewSubscription = this.disruptionService.previewDisruption$.subscribe(
			dis => (this.disruption = dis));
		this.historySubscription = this.auditHistoryService.auditHistory$.subscribe(
			history => (this.history = history)
		);
		this.loadingSubscription = this.disruptionService.loading$.subscribe(
			loading => loading ? (this.spinner.show()) : (this.spinner.hide())
		);
	}

	ngOnDestroy(): void {
		this.disruptionService.clearPreviewDisruption();
		this.auditHistoryService.clearDisruption();

		if (this.previewSubscription) {
			this.previewSubscription.unsubscribe();
		}
		if (this.historySubscription) {
			this.historySubscription.unsubscribe();
		}
		if (this.loadingSubscription) {
			this.loadingSubscription.unsubscribe();
		}
	}

	setActive(tab: string) {
		this.activeTab = tab;
	}

	disruptionSet(): boolean {
		return this.disruption !== null;
	}

	closeSummary(): void {
		this.disruptionService.clearPreviewDisruption();
		this.auditHistoryService.clearDisruption();
	}

	formatUsername(user: string) {
		return user ? `${user}, ` : '';
	}

	get deleteRedirectUrl() {
		return this.disruption && this.disruption.isTemplate ? 'disruptions/templates' : 'disruptions';
	}
}
