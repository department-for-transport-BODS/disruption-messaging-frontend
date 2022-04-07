import { Injectable } from '@angular/core';
import { IDisruptionNode } from 'src/generated/graphql';
import { DisruptionMapperBase } from '../../shared/disruption-mapper/disruptions.mapper';
import { IDisruptionStatus, IDisruptionReason } from 'src/generated/enum-overrides';
import { DisruptionPreviewViewModel } from './disruption-preview.viewmodel';

@Injectable({
	providedIn: 'root'
})
export class DisruptionPreviewMapper extends DisruptionMapperBase {
	getDisruptionPreview(gqlNode: IDisruptionNode): DisruptionPreviewViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			encodedId: gqlNode.id,
			title: gqlNode.title,
			createdBy: gqlNode.createdBy && gqlNode.createdBy.username,
			isTemplate: gqlNode.isTemplate,
			severity: gqlNode.severity,
			status: IDisruptionStatus[gqlNode.status],
			isLive: gqlNode.isLive,
			description: gqlNode.description,
			reason: IDisruptionReason[gqlNode.reason],
			delay: this.getMaximumDelay(gqlNode.impact.edges),
			operatorWide: DisruptionMapperBase.isOperatorWide(gqlNode.impact.edges),
			networkWide: DisruptionMapperBase.isNetworkWide(gqlNode.impact.edges),
			servicesAffected: this.getServicesAffected(gqlNode.impact.edges),
			stopsSummary: this.getStopsSummary(gqlNode.impact.edges),
			operators: this.getOperators(gqlNode.impact.edges),
			duration: this.getDuration(gqlNode.validityPeriod, gqlNode.isOpenEnded),
			validityPeriods: this.getValidityPeriods(gqlNode.validityPeriod)
		};
	}
}
