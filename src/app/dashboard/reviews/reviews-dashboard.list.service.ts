import { Observable, BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { IReviewsDashboardListGQL, IDisruptionNode, IRecentlyClosedGQL } from 'src/generated/graphql';
import { Injectable } from '@angular/core';
import { ReviewsDashboardListMapper } from './reviews-dashboard.list.mapper';
import { ReviewsDashboardListViewModel } from './reviews-dashboard.list.viewmodel';
import { environment } from '../../../environments/environment';


@Injectable({
	providedIn: 'root'
})
export class ReviewsDashboardListService {
	constructor(
		private reviewsListGQL: IReviewsDashboardListGQL,
		private recentlyClosedGQL: IRecentlyClosedGQL,
		private mapper: ReviewsDashboardListMapper) {}

	private reviewsCount = new BehaviorSubject<number>(0);
	private recentlyClosedCount = new BehaviorSubject<number>(0);

	get reviewsCount$() {
		return this.reviewsCount.asObservable();
	}

	get recentlyClosedCount$() {
		return this.recentlyClosedCount.asObservable();
	}

	listReviews(): Observable<ReviewsDashboardListViewModel[]> {
		return this.reviewsListGQL
			.watch({}, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					this.reviewsCount.next(result.data.allDisruptions.totalCount);
					return result.data.allDisruptions.edges.map(edge =>
						this.mapper.getReviewDasboardModel(edge.node as IDisruptionNode)
					);
				})
		);
	}

	recentlyClosed(): Observable<ReviewsDashboardListViewModel[]> {
		return this.recentlyClosedGQL
			.watch({}, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					this.recentlyClosedCount.next(result.data.recentlyClosed.totalCount);
					return result.data.recentlyClosed.edges.map(edge =>
						this.mapper.getReviewDasboardModel(edge.node as IDisruptionNode)
					);
				})
		);
	}
}
