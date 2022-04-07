import { Observable} from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {IReviewsListGQL, IDisruptionNode} from 'src/generated/graphql';
import { ReviewsListMapper } from './reviews-list.mapper';
import { Injectable } from '@angular/core';
import { ReviewsListViewModel } from './reviews-list.viewmodel';


@Injectable({
	providedIn: 'root'
})
export class ReviewsListService {
	constructor(
		private reviewsListGQL: IReviewsListGQL,
		private reviewsListMapper: ReviewsListMapper
	) {}


	listReviews(): Observable<ReviewsListViewModel[]> {
		return this.reviewsListGQL
			.watch()
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => result.data.allDisruptions.edges.map(
					edge => this.reviewsListMapper.getReviewsListModel(edge.node as IDisruptionNode)
					)
				)
		);
	}
}
