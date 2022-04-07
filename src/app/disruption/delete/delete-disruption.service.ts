import { Injectable } from '@angular/core';
import {
	IDeleteDisruptionGQL
} from 'src/generated/graphql';
import { BehaviorSubject } from 'rxjs';
import { IdFormatter } from 'src/app/shared/formatters/id.formatter';
import { tap } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class DeleteDisruptionService {

	constructor(
		private deleteDisruption: IDeleteDisruptionGQL
	) {}

	private errorSubject = new BehaviorSubject<any>(null);

	get errors$() {
		return this.errorSubject.asObservable();
	}

	private statusSubject = new BehaviorSubject<string>('confirm');

	get status$() {
		return this.statusSubject.asObservable();
	}

	private loadingSubject = new BehaviorSubject<any>(false);

	get loading$() {
		return this.loadingSubject.asObservable();
	}

	public delete(id: number): void {
		const encodedId =  IdFormatter.encodeDisruptionId(id);
		this.loadingSubject.next(true);
		this.deleteDisruption
			.mutate({ id : encodedId})
			.pipe(tap(() => this.loadingSubject.next(false)))
			.subscribe(res => {
			if (res.data.deleteDisruption.success) {
				this.statusSubject.next('success');
			} else {
				this.errorSubject.next(res.data.deleteDisruption.errors);
				this.statusSubject.next('error');
			}
		});
	}

	public reset(): void {
		this.statusSubject.next('confirm');
		this.errorSubject.next(null);
	}
}
