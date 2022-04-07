import { IDisruptionNode } from 'src/generated/graphql';
import { IDisruptionStatus } from 'src/generated/enum-overrides';
import { IdFormatter } from '../formatters/id.formatter';

export class RelatedDisruptionViewModel {
	id: string;
	encodedId: string;
	title: string;
	status: string;

	constructor(gqlNode: IDisruptionNode) {
		this.id = IdFormatter.decodeBase64Id(gqlNode.id),
		this.encodedId = gqlNode.id,
		this.title = gqlNode.title,
		this.status = IDisruptionStatus[gqlNode.status];
	}
}
