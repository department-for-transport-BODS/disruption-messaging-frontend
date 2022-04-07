import { Injectable } from '@angular/core';
import { IDisruptionNode } from 'src/generated/graphql';
import { ReviewsDashboardListViewModel } from './reviews-dashboard.list.viewmodel';
import { DisruptionMapperBase } from 'src/app/shared/disruption-mapper/disruptions.mapper';

@Injectable({
	providedIn: 'root'
})
export class ReviewsDashboardListMapper extends DisruptionMapperBase {
	getReviewDasboardModel(gqlNode: IDisruptionNode): ReviewsDashboardListViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			title: gqlNode.title
		};
	}
}
