import { Injectable } from '@angular/core';
import { IDisruptionNode, IDisruptionByIdGQL } from 'src/generated/graphql';
import { DisruptionReviewMapper } from './view-disruption.mapper';
import { ViewDisruptionViewModel } from './view-disruption.viewmodel';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ViewDisruptionService {
	constructor(
		private disruptionByIdGQL: IDisruptionByIdGQL,
		private disruptionReviewMapper: DisruptionReviewMapper
	) {}

	private currentDisruptionSubject = new Subject<ViewDisruptionViewModel>();
	get currentDisruption$() {
		return this.currentDisruptionSubject.asObservable();
	}

	private errorSubject = new BehaviorSubject<any>(null);

	get errors$() {
		return this.errorSubject.asObservable();
	}

	public statusSubject = new BehaviorSubject<string>('approve');

	get status$() {
		return this.statusSubject.asObservable();
	}

	public clearCurrentDisruption() {
		this.errorSubject.next(null);
		this.currentDisruptionSubject.next(null);
	}

	public setCurrentDisruption(id: number) {
		const encodedId = this.disruptionReviewMapper.encodeDisruptionId(id);
		this.disruptionByIdGQL.watch({ id: encodedId }).valueChanges.subscribe(
			result => {
				if (result.errors) {
					this.currentDisruptionSubject.next(null);
					this.errorSubject.next(result.errors);
				} else if (result.data) {
					const disruption = result.data.disruption as IDisruptionNode;
					const vm = this.disruptionReviewMapper.toDisruptionReviewViewModel(disruption);
					this.currentDisruptionSubject.next(vm);
				}
			},
			error => {
				this.errorSubject.next(error);
			}
		);
	}

	public reset(): void {
		this.statusSubject.next('approve');
		this.errorSubject.next(null);
	}
}
