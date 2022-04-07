import { Injectable } from '@angular/core';
import { IDisruptionNode } from 'src/generated/graphql';
import { DisruptionMapperBase } from '../../shared/disruption-mapper/disruptions.mapper';
import { IDisruptionStatus, IDisruptionReason, IDisruptionType } from 'src/generated/enum-overrides';
import { ViewDisruptionViewModel } from './view-disruption.viewmodel';

@Injectable({
	providedIn: 'root'
})
export class DisruptionReviewMapper extends DisruptionMapperBase {
	toDisruptionReviewViewModel(gqlNode: IDisruptionNode): ViewDisruptionViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			encodedId: gqlNode.id,
			title: gqlNode.title,
			isTemplate: gqlNode.isTemplate,
			severity: gqlNode.severity,
			status: IDisruptionStatus[gqlNode.status],
			description: gqlNode.description,
			link: gqlNode.link,
			type: IDisruptionType[gqlNode.type],
			reason: IDisruptionReason[gqlNode.reason],
			delay: this.getMaximumDelay(gqlNode.impact.edges),
			publishingStart: this.getShortDateNoTime(gqlNode.publishingStart),
			publishingEnd: this.getShortDateNoTime(gqlNode.publishingEnd),
			validityPeriods: this.getValidityPeriods(gqlNode.validityPeriod),
			duration: this.getDuration(gqlNode.validityPeriod, gqlNode.isOpenEnded),
			relatedDisruptions: this.getRelatedDisruptions(gqlNode.relatedDisruption),
			impacts: this.getImpacts(gqlNode.impact),
			socialMessages: this.getSocialMessages(gqlNode.socialMessages),
			comments: this.getComments(gqlNode.comments)
		};
	}
}
