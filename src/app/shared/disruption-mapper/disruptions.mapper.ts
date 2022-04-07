import { Injectable } from '@angular/core';
import * as moment from 'moment';

import {
	IDisruptionImpactNodeEdge,
	IStopPointNodeConnection,
	IValidityPeriodType,
	IDisruptionNodeConnection,
	IDisruptionImpactNodeConnection,
	ISocialMessageType,
	ICommentType,
	IDisruptionImpactNode,
	ILineNodeConnection,
	IOperatorNodeConnection
} from 'src/generated/graphql';
import { IDisruptionImpactMode } from 'src/generated/enum-overrides';

import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { IdFormatter } from 'src/app/shared/formatters/id.formatter';

import { ValidityPeriodViewModel } from './validity-period.viewmodel';
import { RelatedDisruptionViewModel } from './related-disruption.viewmodel';
import { ImpactViewModel } from './impact.viewmodel';
import { SocialMessageViewModel } from './social-message.viewmodel';
import { CommentViewModel } from './comment.viewmodel';
import { IImpactType } from '../impact.type.enum';

@Injectable({
	providedIn: 'root'
})
export abstract class DisruptionMapperBase {
	/* node level data */
	static isNetworkWide(impactNodes: IDisruptionImpactNodeEdge[]): boolean {
		let networkWide = 0;
		let operatorWide = 0;
		impactNodes.map(impact => {
			const isNetworkWide = ((!impact.node.lines || impact.node.lines.edges.length === 0) &&
				(!impact.node.stops || impact.node.stops.edges.length === 0) &&
				(!impact.node.operators || impact.node.operators.edges.length === 0));
			const isOperatorWide = ((!impact.node.lines || impact.node.lines.edges.length === 0) &&
				(!impact.node.stops || impact.node.stops.edges.length === 0) &&
				(!impact.node.operators || impact.node.operators.edges.length !== 0));
			if (isNetworkWide) { networkWide += 1; }
			if (isOperatorWide) { operatorWide += 1; }
		});
		return (networkWide > 0 && networkWide + operatorWide === impactNodes.length);
	}

	static isOperatorWide(impactNodes: IDisruptionImpactNodeEdge[]): boolean {
		let operatorWide = 0;
		impactNodes.map(impact => {
			const isOperatorWide = ((!impact.node.lines || impact.node.lines.edges.length === 0) &&
				(!impact.node.stops || impact.node.stops.edges.length === 0) &&
				(!impact.node.operators || impact.node.operators.edges.length !== 0));
			if (isOperatorWide) { operatorWide += 1; }
		});
		return (operatorWide > 0 && operatorWide === impactNodes.length);
	}

	protected decodeBase64Id(encodedId: string): string {
		return IdFormatter.decodeBase64Id(encodedId);
	}

	// allow this to be called publicly

	public encodeDisruptionId(id: number): string {
		return IdFormatter.encodeDisruptionId(id);
	}

	/* Impacts */

	protected getImpacts(impacts: IDisruptionImpactNodeConnection): ImpactViewModel[] {
		return impacts.edges.map(edge => new ImpactViewModel(edge.node));
	}

	protected getOperators(impacts: IDisruptionImpactNodeEdge[]): string {
		return impacts
			.filter(impact => impact.node.operators && impact.node.operators.edges.length)
			.map(impact => this.getOperatorsSummaryForImpact(impact.node.operators))
			.join(', ');
	}

	protected ImpactUniqueServiceModes(impactNodes: IDisruptionImpactNodeEdge[]): string {
		return impactNodes
			.map(edge => IDisruptionImpactMode[edge.node.mode])
			.filter((value, index, self) => self.indexOf(value) === index)
			.join();
	}

	protected getMaximumDelay(impactNodes: IDisruptionImpactNodeEdge[]): string {
		const delayNumber = impactNodes.reduce(
			(prev, current) => (prev === 0 || current.node.delay > prev ? current.node.delay : prev),
			0
		);
		return delayNumber > 0 ? delayNumber.toString() : 'Not set';
	}

	protected getServicesAffected(impactNodes: IDisruptionImpactNodeEdge[]): string {
		if (!impactNodes.length) { return 'None'; }

		const servicesAffected = impactNodes
			.filter(impact => impact.node.lines && impact.node.lines.edges.length)
			.map(
				impact =>
					IDisruptionImpactMode[impact.node.mode] + ': ' + this.getServicesSummaryForImpact(impact.node.lines)
			)
			.join(', ');
		return servicesAffected ? servicesAffected : 'All services';
	}

	protected getOperatorsCount(impactNodes: IDisruptionImpactNodeEdge[]): number {
		let totalOperators = 0;
		impactNodes.map(impact => {
			totalOperators += impact.node.operators ? impact.node.operators.edges.length : 0;
		});
		return totalOperators;
	}

	protected getServicesAffectedCount(impactNodes: IDisruptionImpactNodeEdge[]): number {
		let totalServices = 0;
		impactNodes.map(impact => {
			totalServices += impact.node.lines ? impact.node.lines.edges.length : 0;
		});
		return totalServices;
	}

	protected getStopsAffected(impactNodes: IDisruptionImpactNodeEdge[]): number {
		let totalStops = 0;
		impactNodes.map(impact => {
			totalStops += impact.node.stops ? impact.node.stops.edges.length : 0;
		});
		return totalStops;
	}

	protected getStopsSummary(impactNodes: IDisruptionImpactNodeEdge[]): string {
		return impactNodes
			.filter(impact => impact.node.stops && impact.node.stops.edges.length)
			.map(impact => this.getStopsSummaryForImpact(impact.node.stops))
			.join(', ');
	}

	private getOperatorsSummaryForImpact(operators: IOperatorNodeConnection): string {
		return operators && operators.edges.map(operator => operator.node.name).join(', ');
	}

	private getServicesSummaryForImpact(lines: ILineNodeConnection): string {
		return lines && lines.edges.map(line => line.node.name).join(', ');
	}

	private getStopsSummaryForImpact(stops: IStopPointNodeConnection): string {
		return stops && stops.edges.map(stop => stop.node.commonName).join(', ');
	}

	protected calculateType(node: IDisruptionImpactNode): string {
		if (node.allOperators) {
			return IImpactType.Network;
		}
		const hasOperator = node.operators && node.operators.edges.length;
		const hasLine = node.lines && node.lines.edges.length;
		const hasStops = node.stops && node.stops.edges.length;

		if (hasOperator && !hasLine) {
			return IImpactType.Operator;
		}
		if (hasLine) {
			return IImpactType.Service;
		}
		if (hasStops) {
			return IImpactType.Stops;
		}

		// default value
		return IImpactType.Network;
	}

	/* Validity Periods */

	protected getValidityPeriods(validityPeriods: IValidityPeriodType[]): ValidityPeriodViewModel[] {
		return validityPeriods.map(vp => new ValidityPeriodViewModel(vp));
	}

	private getStartDateTime(vp: IValidityPeriodType) {
		return DateFormatter.createAMoment(vp.startDate, vp.startTime);
	}

	private getEndDate(vp: IValidityPeriodType) {
		return vp.finalDate ? DateFormatter.createAMoment(vp.finalDate, null) :
			DateFormatter.createAMoment(vp.endDate, vp.endTime);
	}

	protected ValidityPeriodEarliestStartDate(validityPeriods: IValidityPeriodType[]): string {
		const earliestVp = validityPeriods.reduce(
			(prev, current) => {
				const currentVp = this.getStartDateTime(current);
				const prevVp = prev ? this.getStartDateTime(prev) : null;
				return !prevVp || currentVp < prevVp ? current : prev;
			}, null
		);

		return earliestVp ? DateFormatter.shortDateString(
				this.getStartDateTime(earliestVp).format()) :
			null;
	}

	protected ValidityPeriodLastEndDate(validityPeriods: IValidityPeriodType[]): string {
		const lastEndDate = validityPeriods.reduce(
				(prev, current) => {
					const prevEndDate = prev ? this.getEndDate(prev) : null;
					const currentEndDate = this.getEndDate(current);
					return !prev || currentEndDate > prevEndDate ? current : prev;
				}, null
		);
		return lastEndDate ? DateFormatter.shortDateString(
				this.getEndDate(lastEndDate).format()) :
			null;
	}

	protected getDuration(validityPeriods: IValidityPeriodType[], isOpenEnded: boolean): string {
		if (isOpenEnded) {
			return 'No end date';
		}

		if (validityPeriods && validityPeriods.length) {
			const startDateTimes = validityPeriods.map(period => this.getDateTime(period.startDate, period.startTime));
			const endDateTimes = validityPeriods.map(
				period => this.getDateTime(period.finalDate ? period.finalDate : period.endDate, period.endTime)
			);

			const earliestTime = startDateTimes.reduce((prev, current) => (current.isBefore(prev) ? current : prev));
			const latestTime = endDateTimes.reduce((prev, current) => (current.isAfter(prev) ? current : prev));

			const duration = moment.duration(latestTime.diff(earliestTime));
			return duration.humanize();
		}
		return '';
	}

	protected getDateTime(date: string, time: string): moment.Moment {
		const d = moment(date, 'YYYY-MM-DD');
		const t = moment(time, 'HH:mm:ss');

		return d.set({
			hour: t.get('hour'),
			minute: t.get('minute'),
			second: t.get('second'),
			millisecond: 0
		});
	}

	/* Messages */

	protected getSocialMessages(socialMessage: ISocialMessageType[]): SocialMessageViewModel[] {
		return socialMessage.map(message => new SocialMessageViewModel(message));
	}

	/* comments */

	protected getComments(comment: ICommentType[]): CommentViewModel[] {
		return comment.map(message => new CommentViewModel(message));
	}


	/* related disruptions */

	protected getRelatedDisruptions(related: IDisruptionNodeConnection): RelatedDisruptionViewModel[] {
		return related.edges.map(edge => new RelatedDisruptionViewModel(edge.node));
	}

	protected getRelatedDisruptionIds(related: IDisruptionNodeConnection): string {
		return related.edges.map(edge => IdFormatter.decodeBase64Id(edge.node.id)).join(',');
	}

	/* utility methods */

	protected getShortDate(inputISOdate: string): string {
		return DateFormatter.shortDateString(inputISOdate);
	}

	protected getShortDateNoTime(inputISOdate: string): string {
		return DateFormatter.shortDateOnlyString(inputISOdate);
	}

	protected capitalize(s: string): string {
		if (typeof s !== 'string') {
			return '';
		}
		return s.charAt(0).toUpperCase() + s.toLowerCase().slice(1);
	}

	protected asMoment(datetime: string): moment.Moment {
		return moment(datetime, 'YYYY-MM-DDTHH:mm');
	}
}
