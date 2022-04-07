import { Injectable } from '@angular/core';
import { IDisruptionNode } from 'src/generated/graphql';
import { ReviewsListViewModel } from './reviews-list.viewmodel';
import { DisruptionMapperBase } from '../shared/disruption-mapper/disruptions.mapper';

@Injectable({
	providedIn: 'root'
})
export class ReviewsListMapper extends DisruptionMapperBase {
	getReviewsListModel(gqlNode: IDisruptionNode): ReviewsListViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			encodedId: gqlNode.id,
			title: gqlNode.title,
			serviceModes: this.ImpactUniqueServiceModes(gqlNode.impact.edges),
			operatorWide: DisruptionMapperBase.isOperatorWide(gqlNode.impact.edges),
			networkWide: DisruptionMapperBase.isNetworkWide(gqlNode.impact.edges),
			operatorsCount: this.getOperatorsCount(gqlNode.impact.edges),
			servicesAffectedCount: this.getServicesAffectedCount(gqlNode.impact.edges),
			stopsAffectedCount: this.getStopsAffected(gqlNode.impact.edges),
			startDate: this.ValidityPeriodEarliestStartDate(gqlNode.validityPeriod),
			endDate: this.ValidityPeriodLastEndDate(gqlNode.validityPeriod),
			severity: gqlNode.severity,
			createdDate: this.getShortDate(gqlNode.created),
			createdBy: gqlNode.createdBy.username
		};
	}
}
