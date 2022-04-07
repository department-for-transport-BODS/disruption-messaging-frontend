import { Injectable } from '@angular/core';
import { IDisruptionNodeConnection } from 'src/generated/graphql';
import { DisruptionMapperBase } from 'src/app/shared/disruption-mapper/disruptions.mapper';
import { DisruptionAutocompleteModel } from './disruption-autocomplete.model';

@Injectable({
	providedIn: 'root'
})
export class IAutoCompleteDisruptionsMapper extends DisruptionMapperBase {
	public getAutocompleteModels(gqlNode: IDisruptionNodeConnection): DisruptionAutocompleteModel[] {
		return gqlNode.edges.map(e => ({
			id: e.node.id,
			title: `${e.node.title} (${this.decodeBase64Id(e.node.id)})`,
			deleted: e.node.deleted,
		}));
	}
}
