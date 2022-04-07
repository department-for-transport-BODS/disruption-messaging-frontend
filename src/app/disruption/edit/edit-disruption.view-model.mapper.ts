import { Injectable } from '@angular/core';
import {
	IDisruptionImpactNodeEdge,
	IDisruptionNode,
	ILineNodeConnection,
	IOperatorNodeConnection,
	IRepetitionInput,
	ISocialMessageType,
	IStopPointNodeConnection,
} from 'src/generated/graphql';
import { DateFormatter } from '../../shared/formatters/date.formatter';
import * as moment from 'moment';
import {
	IEditDisruptionViewModel,
	IEditImpactViewModel,
	IEditSocialMessageViewModel
} from './edit-disruption.view.model';
import {
	IDisruptionImpactMode,
	IDisruptionImpactSeverity,
	IDisruptionReason,
	IDisruptionType,
	IStopPointType,
	IDisruptionImpactDirectionReverse
} from 'src/generated/enum-overrides';
import { DisruptionMapperBase } from 'src/app/shared/disruption-mapper/disruptions.mapper';
import { IAutoCompleteDisruptionsMapper } from './overview/autocomplete-disruptions/autocomplete-disruptions.mapper';
import { SocialAccountViewModelMapper } from '../../social/social.view-model.mapper';

@Injectable({
	providedIn: 'root'
})
export class IEditDisruptionViewModelMapper extends DisruptionMapperBase {
	constructor(
		private autocompleteMapper: IAutoCompleteDisruptionsMapper,
		private socialAccountViewModelMapper: SocialAccountViewModelMapper
	) {
		super();
	}

	private static mapLines(linesEdges: ILineNodeConnection): any[] {
		if (!linesEdges || !linesEdges.edges) {
			return [];
		}
		return linesEdges.edges.map(line => ({ featureName: line.node.name, entityId: line.node.ref }));
	}

	private static mapOperators(operatorsEdges: IOperatorNodeConnection): any[] {
		if (!operatorsEdges || !operatorsEdges.edges) {
			return [];
		}
		return operatorsEdges.edges.map(op => ({ name: op.node.name, entityId: op.node.ref }));
	}

	public toEditDisruptionViewModel(node: IDisruptionNode): IEditDisruptionViewModel {
		return {
			id: node.id,
			decodedId: this.decodeBase64Id(node.id),
			summary: node.title,
			description: node.description,
			link: node.link,
			disruptionType: IDisruptionType[node.type],
			reason: node.reason ? IDisruptionReason[node.reason] : IDisruptionReason.A_1000,
			isTemplate: node.isTemplate,
			publishingStart: node.publishingStart ? moment.utc(node.publishingStart).local() : null,
			publishingEnd: node.publishingEnd ? moment.utc(node.publishingEnd).local() : null,
			related: node.relatedDisruption && this.autocompleteMapper.getAutocompleteModels(node.relatedDisruption),
			validityPeriods:
				node.validityPeriod &&
				node.validityPeriod.map(e => ({
					startDate: DateFormatter.createAMoment(e.startDate, e.startTime),
					endDate: e.endDate ? DateFormatter.createAMoment(e.endDate, e.endTime) : null,
					repeats: IRepetitionInput[this.capitalize(e.repetition)],
					ending: e.finalDate ? moment.utc(e.finalDate).local() : null,
					id: e.id
				})),
			impacts: node.impact && this.mapImpactForm(node.impact.edges),
			socialMessages: this.mapSocialMessages(node.socialMessages),
			isOpenEnded: node.isOpenEnded
		};
	}

	private mapImpactForm(edges: IDisruptionImpactNodeEdge[]): IEditImpactViewModel[] {
		if (!edges) {
			return [];
		}
		return edges.map(e => {
			return {
				id: e.node.id,
				mode: IDisruptionImpactMode[e.node.mode],
				type: this.calculateType(e.node),
				advice: e.node.advice,
				delay: e.node.delay,
				journeyPlanners: e.node.journeyPlanner.toString(),
				severity: IDisruptionImpactSeverity[e.node.severity]
					? IDisruptionImpactSeverity[e.node.severity].replace(/\s/g, '')
					: '',
				operators: IEditDisruptionViewModelMapper.mapOperators(e.node.operators),
				lines: IEditDisruptionViewModelMapper.mapLines(e.node.lines),
				stops: this.mapStops(e.node.stops),
				direction: IDisruptionImpactDirectionReverse[e.node.direction]
			} as IEditImpactViewModel;
		});
	}

	private mapStops(stopsEdges: IStopPointNodeConnection): any[] {
		if (!stopsEdges || !stopsEdges.edges) {
			return [];
		}
		return stopsEdges.edges.map(stop => {
			const atcoCode = stop.node.atcoCode !== null ? stop.node.atcoCode : stop.node.ref.substr(2);

			return {
				entityId: stop.node.ref,
				lon: stop.node.longitude && stop.node.longitude.toString(),
				lat: stop.node.latitude && stop.node.latitude.toString(),
				featureName: stop.node.commonName,
				displayName: `${stop.node.commonName} (${atcoCode})`,
				atcoCode,
				lineIds: [],
				features: [],
				stopType: IStopPointType[stop.node.type]
			};
		});
	}

	private mapSocialMessages(messages: ISocialMessageType[]): IEditSocialMessageViewModel[] {
		if (!messages) {
			return [];
		}

		return messages.map(msg => ({
			id: msg.id,
			socialAccount: this.socialAccountViewModelMapper.getModel(msg.socialAccount),
			hootSuiteProfile: msg.hootsuiteProfile,
			text: msg.message,
			image: msg.image,
			publishOn: moment.utc(msg.publishOn).local(),
			publishedOn: moment.utc(msg.publishedOn).local(),
			published: msg.published,
			lastPublishedError: msg.lastPublishError
		}));
	}
}
