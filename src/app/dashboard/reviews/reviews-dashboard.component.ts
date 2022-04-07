import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReviewsDashboardListViewModel } from './reviews-dashboard.list.viewmodel';
import { Observable } from 'rxjs';
import { ReviewsDashboardListService } from './reviews-dashboard.list.service';
import { Subscription } from 'apollo-client/util/Observable';

@Component({
	selector: 'dm-reviews-dashboard',
	templateUrl: './reviews-dashboard.component.html',
	styleUrls: ['./reviews-dashboard.component.scss']
})
export class ReviewsDashboardComponent implements OnInit, OnDestroy {
	reviews$: Observable<ReviewsDashboardListViewModel[]>;
	recentlyClosed$: Observable<ReviewsDashboardListViewModel[]>;

	reviewsCount: number;
	recentlyClosedCount: number;

	reviewsCountSub: Subscription;
	recentlyClosedCountSub: Subscription;

	constructor(private service: ReviewsDashboardListService) {}

	ngOnInit() {
		this.reviews$ = this.service.listReviews();
		this.recentlyClosed$ = this.service.recentlyClosed();
		this.reviewsCountSub = this.service.reviewsCount$.subscribe(s => (this.reviewsCount = s));
		this.recentlyClosedCountSub = this.service.recentlyClosedCount$.subscribe(s => (this.recentlyClosedCount = s));
	}

	ngOnDestroy() {
		if (this.reviewsCountSub) {
			this.reviewsCountSub.unsubscribe();
		}
		if (this.recentlyClosedCountSub) {
			this.recentlyClosedCountSub.unsubscribe();
		}
	}
}
