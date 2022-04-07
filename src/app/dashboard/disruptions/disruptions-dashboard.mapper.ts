import { Injectable } from '@angular/core';
import { IDisruptionNode } from 'src/generated/graphql';
import { DisruptionMapperBase } from '../../shared/disruption-mapper/disruptions.mapper';
import { DisruptionsDashboardViewModel } from './disruptions-dashboard.viewmodel';

@Injectable({
	providedIn: 'root'
})
export class DisruptionsDashboardMapper extends DisruptionMapperBase {
	getDisruptionsForDashboard(gqlNode: IDisruptionNode): DisruptionsDashboardViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			encodedId: gqlNode.id,
			title: gqlNode.title,
			operatorWide: DisruptionMapperBase.isOperatorWide(gqlNode.impact.edges),
			networkWide: DisruptionMapperBase.isNetworkWide(gqlNode.impact.edges),
			operatorCount: this.getOperatorsCount(gqlNode.impact.edges),
			servicesAffectedCount: this.getServicesAffectedCount(gqlNode.impact.edges),
			stopsAffectedCount: this.getStopsAffected(gqlNode.impact.edges),
			startDate: this.ValidityPeriodEarliestStartDate(gqlNode.validityPeriod),
			endDate: this.ValidityPeriodLastEndDate(gqlNode.validityPeriod),
			severity: gqlNode.severity
		};
	}
}
