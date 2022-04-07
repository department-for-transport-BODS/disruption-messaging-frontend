import { DisruptionsDashboardMapper } from './disruptions-dashboard.mapper';
import { DisruptionViewModelsTestBuilder } from 'src/app/shared/disruption-mapper/disruption-viewmodels.test-builder';
import { IDisruptionNode } from 'src/generated/graphql';
import { cloneDeep } from 'lodash';

describe('DisruptionsDashboardMapper', () => {
	let mapper: DisruptionsDashboardMapper;
	let node: IDisruptionNode;
	beforeEach(() => {
		node = new DisruptionViewModelsTestBuilder().createIDisruptionNode();
		mapper = new DisruptionsDashboardMapper();
	});

	it('should id to model', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.id).toBe('1395');
	});

	it('should map encoded id', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.encodedId).toBe(node.id);
	});

	it('should map title', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.title).toBe(node.title);
	});

	it('should map services affected', () => {
		const disruption = cloneDeep(node);
		disruption.impact.edges[0].node = new DisruptionViewModelsTestBuilder().createImpactNodeWithLine('L001');
		const result = mapper.getDisruptionsForDashboard(disruption);
		expect(result.servicesAffectedCount).toBe(1);
	});

	it('should map stopsAffectedCount', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.stopsAffectedCount).toBe(0);
	});

	it('should map startDate', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.startDate).toBe('Tue 27 Aug 19');
	});

	it('should map endDate', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.endDate).toBe('Sun 1 Sep 19');
	});

	it('should map severity', () => {
		const result = mapper.getDisruptionsForDashboard(node);
		expect(result.severity).toBe(result.severity);
	});
});
