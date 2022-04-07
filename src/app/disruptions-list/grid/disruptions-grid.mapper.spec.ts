import { DisruptionViewModelsTestBuilder } from '../../shared/disruption-mapper/disruption-viewmodels.test-builder';
import {
	IDisruptionNode,
	IDisruptionImpactNodeEdge,
	IStopPointNodeConnection,
	IStopPointNodeEdge,
	IStopPointNode
} from 'src/generated/graphql';
import { IDisruptionStatus, IStopPointType } from 'src/generated/enum-overrides';
import { DisruptionsGridRowViewModel } from './disruptions-gridrow.viewmodel';
import { DisruptionsGridMapper } from './disruptions-grid.mapper';

describe('disruptionsGridRowViewModelMapper', () => {
	const testDataBuilder = new DisruptionViewModelsTestBuilder();
	const mapper = new DisruptionsGridMapper();
	let baseNode: IDisruptionNode;

	beforeEach(() => {
		baseNode = testDataBuilder.createIDisruptionNode();
	});

	it('should set the title', () => {
		const expectedTitle = 'A Title';
		baseNode.title = expectedTitle;
		const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

		expect(viewModel.title).toBe(expectedTitle);
	});

	it('should not failed when title not set', () => {
		baseNode.title = null;
		const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

		expect(viewModel.title).toBeFalsy();
	});

	it('should set severity', () => {
		baseNode.severity = 'Very Slight';
		const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

		expect(viewModel.severity).toBe('Very Slight');
	});

	it('should set status', () => {
		/** A_3 = 'Approved Draft' */
		baseNode.status = 'A_3' as IDisruptionStatus;
		const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

		expect(viewModel.status).toBe('Approved Draft');
	});

	// is this correct? Feels like the id should be the other way round?!
	it('should decode id', () => {
		const intId = '1';
		const type = 'blah';
		baseNode.id = btoa(`${type}:${intId}`);

		const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

		expect(viewModel.id).toBe(intId);
	});

	describe('affectedServices', () => {
		beforeEach(() => {
			const busStop: IStopPointNode = {
				id: 'HS',
				commonName: 'High Street',
				atcoCode: '',
				type: IStopPointType.A_1
			} as IStopPointNode;

			const busStopTwo: IStopPointNode = {
				id: 'MS',
				commonName: 'Mill Street',
				atcoCode: '',
				type: IStopPointType.A_1
			} as IStopPointNode;

			const busStopEdges: Array<IStopPointNodeEdge> = [
				{ cursor: '', node: busStopTwo },
				{ cursor: '', node: busStop }
			];

			const busStops: IStopPointNodeConnection = {
				edges: busStopEdges,
				pageInfo: null
			};

			const busway = testDataBuilder.createImpactNodeWithLine('Busway A');
			busway.stops = busStops;

			const arrayOfImpacts: Array<IDisruptionImpactNodeEdge> = [{ cursor: '', node: busway }];
			baseNode.impact.edges = arrayOfImpacts;
		});

		it('should give count of services', () => {
			const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

			expect(viewModel.servicesAffectedCount).toBe(1);
		});

		it('should give count of stops', () => {
			const viewModel: DisruptionsGridRowViewModel = mapper.getRowModel(baseNode);

			expect(viewModel.stopsAffectedCount).toBe(2);
		});
	});
});
