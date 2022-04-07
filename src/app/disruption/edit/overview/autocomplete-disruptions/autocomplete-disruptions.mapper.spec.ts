import { IAutoCompleteDisruptionsMapper } from './autocomplete-disruptions.mapper';
import { IDisruptionNodeConnection } from 'src/generated/graphql';
import { DisruptionViewModelsTestBuilder } from 'src/app/shared/disruption-mapper/disruption-viewmodels.test-builder';

describe('AutocompleteDisruptionsMapper', () => {
	it('should get autocomplete models', () => {
		const disruption = new DisruptionViewModelsTestBuilder().createIDisruptionNode();
		const node: IDisruptionNodeConnection = {
			pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: '' },
			edges: [
				{
					cursor: '',
					node: disruption
				}
			],
			totalCount: 0
		};

		const mapper = new IAutoCompleteDisruptionsMapper();
		const result = mapper.getAutocompleteModels(node);

		expect(result[0].id).toBe(node.edges[0].node.id);
		expect(result[0].title).toBe(node.edges[0].node.title + ' (1395)');
	});
});
