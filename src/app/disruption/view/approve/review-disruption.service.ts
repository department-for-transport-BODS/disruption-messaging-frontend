import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IdFormatter } from 'src/app/shared/formatters/id.formatter';
import { IApproveDisruptionGQL, IRejectDisruptionGQL } from 'src/generated/graphql';
import { tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ReviewDisruptionService {
	constructor(private approveDisruption: IApproveDisruptionGQL, private rejectDisruption: IRejectDisruptionGQL) {}

	private errorSubject = new BehaviorSubject<any>(null);

	get errors$() {
		return this.errorSubject.asObservable();
	}

	private statusSubject = new BehaviorSubject<string>('approve');

	get status$() {
		return this.statusSubject.asObservable();
	}

	private loadingSubject = new BehaviorSubject<boolean>(false);

	get loading$() {
		return this.loadingSubject.asObservable();
	}

	public setStatus(val: string) {
		this.statusSubject.next(val);
	}

	public approve(id: number): void {
		const encodedId = IdFormatter.encodeDisruptionId(id);

		this.loadingSubject.next(true);
		this.approveDisruption.mutate({ id: encodedId })
			.pipe(tap(() => this.loadingSubject.next(false)))
			.subscribe(res => {
				if (res.data.approveDisruption.success) {
					this.statusSubject.next('success');
				} else {
					this.errorSubject.next(res.data.approveDisruption.errors);
					this.statusSubject.next('error');
				}
			});
	}

	public reject(id: number, comment: string): void {
		const encodedId = IdFormatter.encodeDisruptionId(id);

		this.rejectDisruption.mutate({ id: encodedId, comment }).subscribe(res => {
			if (res.data.rejectDisruption.success) {
				this.statusSubject.next('success');
			} else {
				this.errorSubject.next(res.data.rejectDisruption.errors);
				this.statusSubject.next('error');
			}
		});
	}

	public reset(): void {
		this.statusSubject.next('approve');
		this.errorSubject.next(null);
	}
}
