import { IDisruptionImpactNode } from 'src/generated/graphql';
import { IdFormatter } from '../formatters/id.formatter';
import { IDisruptionImpactMode, IDisruptionImpactSeverity } from 'src/generated/enum-overrides';
import { IImpactType } from '../impact.type.enum';

export class ImpactViewModel {
	id: string;
	advice: string;
	name: string;
	severity: string;
	mode: string;
	type: IImpactType;
	delay: number;
	operatorIds: string[];
	operators: string[];
	operatorNames: string;
	lineIds: string[];
	lineNames: string;
	lines: string[];
	stopNames: string[];
	stopNaptans: string[];
	stopAtcos: string;
	journeyPlanner: boolean;
	direction: string;
	allOperators: boolean;

	constructor(gqlImpact: IDisruptionImpactNode) {
		this.id = IdFormatter.decodeBase64Id(gqlImpact.id);
		this.name = gqlImpact.name;
		this.advice = gqlImpact.advice;
		this.severity = IDisruptionImpactSeverity[gqlImpact.severity];
		this.mode = IDisruptionImpactMode[gqlImpact.mode];
		this.delay = gqlImpact.delay;
		this.operatorIds = gqlImpact.operators ? gqlImpact.operators.edges.map(edge => edge.node.id) : [];
		this.operators = gqlImpact.operators ? gqlImpact.operators.edges.map(edge => edge.node.name) : [];
		this.operatorNames = gqlImpact.operators ? gqlImpact.operators.edges.map(edge => edge.node.name).join(',') : '';
		this.lineIds = gqlImpact.lines ? gqlImpact.lines.edges.map(edge => edge.node.id) : [];
		this.lineNames = gqlImpact.lines ? gqlImpact.lines.edges.map(edge => edge.node.name).join(',') : '';
		this.lines = gqlImpact.lines ? gqlImpact.lines.edges.map(edge => edge.node.name) : [];
		this.stopNames = gqlImpact.stops ? gqlImpact.stops.edges.map(edge => edge.node.commonName) : [];
		this.stopNaptans = gqlImpact.stops ? gqlImpact.stops.edges.map(edge => edge.node.naptanCode) : [];
		this.stopAtcos = gqlImpact.stops ? gqlImpact.stops.edges.map(edge => edge.node.atcoCode).join(',') : '';
		this.journeyPlanner = gqlImpact.journeyPlanner;
		this.direction = gqlImpact.direction;
		this.allOperators = gqlImpact.allOperators;
		this.type = this.impactType;
	}

	get impactType() {
		if (this.lineIds && this.lineIds.length) {
			return IImpactType.Service;
		}
		if (this.operatorIds && this.operatorIds.length) {
			return IImpactType.Operator;
		}
		if (this.stopNames && this.stopNames.length) {
			return IImpactType.Stops;
		}
		return IImpactType.Network;
	}
}
