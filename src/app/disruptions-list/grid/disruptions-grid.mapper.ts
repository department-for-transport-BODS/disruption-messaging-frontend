import { Injectable } from '@angular/core';
import { IDisruptionNode, IDisruptionNodeConnection } from 'src/generated/graphql';
import { DisruptionsGridRowViewModel, AllDisruptionFieldsGridRowViewModel } from './disruptions-gridrow.viewmodel';
import { DisruptionsGridModel } from './disruptions-grid.model';
import { DisruptionMapperBase } from '../../shared/disruption-mapper/disruptions.mapper';
import { IDisruptionStatus } from 'src/generated/enum-overrides';
import {IDisruptionType, IDisruptionReason} from 'src/generated/enum-overrides';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class DisruptionsGridMapper extends DisruptionMapperBase {
	getGridModel(gqlNode: IDisruptionNodeConnection): DisruptionsGridModel {
		return new DisruptionsGridModel(
			gqlNode.totalCount,
			gqlNode.pageInfo.hasNextPage,
			gqlNode.pageInfo.endCursor,
			gqlNode.edges.map(e => this.getRowModel(e.node as IDisruptionNode))
		);
	}

	getExportModel(gqlNode: IDisruptionNodeConnection): DisruptionsGridModel {
		return new DisruptionsGridModel(
			gqlNode.totalCount,
			gqlNode.pageInfo.hasNextPage,
			gqlNode.pageInfo.endCursor,
			gqlNode.edges.map(e => this.getExportTableModel(e.node as IDisruptionNode))
		);
	}

	getExportAllFieldsModel(gqlNode: IDisruptionNodeConnection): AllDisruptionFieldsGridRowViewModel[] {
		return gqlNode.edges.map(e => this.getExportAllFieldsTableModel(e.node as IDisruptionNode));
	}

	getExportAllFieldsTableModel(gqlNode: IDisruptionNode): AllDisruptionFieldsGridRowViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			title: gqlNode.title,
			description: gqlNode.description,
			link: gqlNode.link != null ? gqlNode.link : '',
			createdBy: gqlNode.createdBy ? gqlNode.createdBy.username : '',
			type: IDisruptionType[gqlNode.type],
			relatedDisruption: this.getRelatedDisruptionIds(gqlNode.relatedDisruption),
			reason: IDisruptionReason[gqlNode.reason],
			publishingStart: gqlNode.publishingStart ? DateFormatter.localDateTimeString(gqlNode.publishingStart) : '',
			publishingEnd: gqlNode.publishingEnd ? DateFormatter.localDateTimeString(gqlNode.publishingEnd) : '',
			isTemplate: gqlNode.isTemplate ? 'TRUE' : 'FALSE',
			organisationName: gqlNode.organisation ? gqlNode.organisation.name : '',
			isOpenEnded: gqlNode.isOpenEnded ? 'TRUE' : 'FALSE',
			deleted: String(gqlNode.deleted).toUpperCase(),
			relatedTo: this.getRelatedDisruptionIds(gqlNode.relatedTo),
			approvedBy: gqlNode.approvedBy ? gqlNode.approvedBy.username : '',
			serviceModes: this.ImpactUniqueServiceModes(gqlNode.impact.edges),
			operatorWide: DisruptionMapperBase.isOperatorWide(gqlNode.impact.edges) ? 'TRUE' : 'FALSE',
			networkWide: DisruptionMapperBase.isNetworkWide(gqlNode.impact.edges) ? 'TRUE' : 'FALSE',
			servicesAffectedCount: this.getServicesAffectedCount(gqlNode.impact.edges),
			stopsAffectedCount: this.getStopsAffected(gqlNode.impact.edges),
			validityPeriods: this.getValidityPeriods(gqlNode.validityPeriod),
			severity: gqlNode.severity,
			isLive: gqlNode.isLive ? 'TRUE' : 'FALSE',
			status: IDisruptionStatus[gqlNode.status],
			impacts: this.getImpacts(gqlNode.impact),
			socialMessages: this.getSocialMessages(gqlNode.socialMessages),
		};
	}

	getExportTableModel(gqlNode: IDisruptionNode): DisruptionsGridRowViewModel {
		return {
			id: this.decodeBase64Id(gqlNode.id),
			title: gqlNode.title,
			serviceModes: this.ImpactUniqueServiceModes(gqlNode.impact.edges),
			operatorWide: DisruptionMapperBase.isOperatorWide(gqlNode.impact.edges),
			networkWide: DisruptionMapperBase.isNetworkWide(gqlNode.impact.edges),
			servicesAffectedCount: this.getServicesAffectedCount(gqlNode.impact.edges),
			stopsAffectedCount: this.getStopsAffected(gqlNode.impact.edges),
			startDate: this.ValidityPeriodEarliestStartDate(gqlNode.validityPeriod),
			endDate: this.ValidityPeriodLastEndDate(gqlNode.validityPeriod),
			severity: gqlNode.severity,
			isLive: gqlNode.isLive,
			status: IDisruptionStatus[gqlNode.status],
		};
	}

	getRowModel(gqlNode: IDisruptionNode): DisruptionsGridRowViewModel {
		return {
			encodedId: gqlNode.id,
			...this.getExportTableModel(gqlNode)
		};
	}

}
