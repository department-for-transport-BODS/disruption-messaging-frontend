import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuditHistoryViewModel } from 'src/app/audit/audit-history.viewmodel';
import { Subscription, Observable } from 'rxjs';
import { AuditHistoryService } from 'src/app/audit/audit-history.service';

@Component({
	selector: 'dm-activity-feed',
	templateUrl: './activity-feed.component.html',
	styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit, OnDestroy {
	auditHistoryLog$: Observable<AuditHistoryViewModel[]>;

	private historySubscription: Subscription;
	constructor(private auditHistoryService: AuditHistoryService) {}

	ngOnInit() {
		this.historySubscription = this.auditHistoryService.setOrgActivityHistory();
		this.auditHistoryLog$ = this.auditHistoryService.auditHistory$;
	}

	ngOnDestroy(): void {
		this.auditHistoryService.clearDisruption();

		if (this.historySubscription) {
			this.historySubscription.unsubscribe();
			this.historySubscription = null;
		}
	}
}
