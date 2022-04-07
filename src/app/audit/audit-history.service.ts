import { Injectable } from '@angular/core';
import { IDisruptionAuditByIdGQL, IDisruptionAuditNode, IOrganisationActivityGQL } from 'src/generated/graphql';
import { AuditHistoryMapper } from './audit-history.mapper';
import { AuditHistoryViewModel } from './audit-history.viewmodel';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuditHistoryService {
	auditSubscription: Subscription;

	constructor(
		private disruptionAuditGQL: IDisruptionAuditByIdGQL,
		private orgAuditGQL: IOrganisationActivityGQL,
		private mapper: AuditHistoryMapper
	) {}

	get auditHistory$() {
		return this.auditHistorySubject.asObservable();
	}

	private auditHistorySubject = new BehaviorSubject<AuditHistoryViewModel[]>(null);

	setAuditHistoryForDisruption(id: string): void {
		if (this.auditSubscription) {
			this.auditSubscription.unsubscribe();
		}
		this.auditSubscription = this.disruptionAuditGQL
			.watch({ id })
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.subscribe(
				result => {
					const vms = result.data.disruptionAudit.edges.map(m =>
						this.mapper.toViewModel(m.node as IDisruptionAuditNode)
					);
					this.auditHistorySubject.next(vms);
				},
				error => {
					// TODO: log errors somewhere
					console.log(error);
				}
		);
	}

	setOrgActivityHistory(): Subscription {
		return this.orgAuditGQL
			.watch({}, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.subscribe(
				result => {
					const vms = result.data.organisationAudit.edges.map(m =>
						this.mapper.toViewModel(m.node as IDisruptionAuditNode)
					);
					this.auditHistorySubject.next(vms);
				},
				error => {
					// TODO: log errors somewhere
					console.log(error);
				}
		);
	}

	clearDisruption(): void {
		this.auditHistorySubject.next(null);
		if (this.auditSubscription) {
			this.auditSubscription.unsubscribe();
			this.auditSubscription = null;
		}
	}
}
