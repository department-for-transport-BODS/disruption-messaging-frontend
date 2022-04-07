import { ReviewsDashboardListMapper } from './reviews-dashboard.list.mapper';
import { DisruptionViewModelsTestBuilder } from 'src/app/shared/disruption-mapper/disruption-viewmodels.test-builder';

describe('ReviewsDashboardListMapper', () => {
	it('should map to view model', () => {
		const mapper = new ReviewsDashboardListMapper();
		const node = new DisruptionViewModelsTestBuilder().createIDisruptionNode();

		const vm = mapper.getReviewDasboardModel(node);

		expect(vm.id).toBe('1395'); // a little sprinkling of magic. We know what the decoded value is.
		expect(vm.title).toEqual(node.title);
	});
});
