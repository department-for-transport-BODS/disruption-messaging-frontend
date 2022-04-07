import { Observable, BehaviorSubject, Subscription, timer } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
	IDisruptionNode,
	IDisruptionPreviewByIdGQL,
	IDisruptionNodeConnection,
	IDisruptionsMapListGQL
} from 'src/generated/graphql';
import { DisruptionPreviewViewModel } from './preview/disruption-preview.viewmodel';
import { DisruptionPreviewMapper } from './preview/disruption-preview.mapper';
import { DisruptionsFilterParameters } from './filter/disruptions-filter-parameters.class';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DisruptionsListService {
	previewSubscription: Subscription;

	constructor(
		private disruptionMapListGQL: IDisruptionsMapListGQL,
		private disruptionPreviewByIdGQL: IDisruptionPreviewByIdGQL,
		private disruptionPreviewMapper: DisruptionPreviewMapper
	) {}

	// state management

	get previewDisruption$() {
		return this.disruptionSubject.asObservable();
	}

	get loading$() {
		return this.loadingSubject.asObservable();
	}

	private loadingSubject = new BehaviorSubject<boolean>(false);
	private disruptionSubject = new BehaviorSubject<DisruptionPreviewViewModel>(null);

	setPreviewDisruption(id: string): void {
		this.loadingSubject.next(true);
		if (this.previewSubscription) {
			this.previewSubscription.unsubscribe();
		}
		this.previewSubscription = this.disruptionPreviewByIdGQL
			.watch({id})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.subscribe(
				result => {
					this.loadingSubject.next(false);
					const disruption = this.disruptionPreviewMapper.getDisruptionPreview(result.data
						.disruption as IDisruptionNode);
					this.disruptionSubject.next(disruption);
				}
			);
	}

	clearPreviewDisruption(): void {
		// reset current disruption to nothing. Use when closing summary panel.
		this.disruptionSubject.next(null);
		if (this.previewSubscription) {
			this.previewSubscription.unsubscribe();
			this.previewSubscription = null;
		}
	}

	// data access queries - refactor out to individual services plus mapping?
	listDisruptionsforMap(filters?: DisruptionsFilterParameters): Observable<IDisruptionNodeConnection> {
		return this.disruptionMapListGQL
			.watch({
				status: filters.status,
				severity: filters.severity,
				mode: filters.mode,
				operators: filters.operators,
				lines: filters.lines,
				startDate: filters.startDate,
				endDate: filters.endDate,
				titleFilter: filters.searchText,
				isTemplate: filters.isTemplate,
				first: 100 // <TODO>: Map doesn't paginate, read from environment variable instead.
			})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					return result.data.allDisruptions as IDisruptionNodeConnection;
				})
			);
	}
}
