import { Component, OnInit } from '@angular/core';
import { ReviewsListService } from './reviews-list.service';
import { Observable } from 'rxjs';
import { ReviewsListViewModel } from './reviews-list.viewmodel';

@Component({
	selector: 'dm-reviews-list',
	templateUrl: './reviews-list.component.html',
	styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {

	reviews$: Observable<ReviewsListViewModel[]>;

	constructor(
		private reviewsListService: ReviewsListService
	) {}

	ngOnInit() {
		this.reviews$ = this.reviewsListService.listReviews();
	}
}
