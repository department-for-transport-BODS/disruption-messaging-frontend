import { DisruptionViewModelsTestBuilder } from './disruption-viewmodels.test-builder';
import {
	IDisruptionNode,
	IDisruptionImpactNodeEdge,
	IStopPointNodeConnection,
	IStopPointNodeEdge,
	IStopPointNode
} from 'src/generated/graphql';
import { IStopPointType } from 'src/generated/enum-overrides';
import { DisruptionsMapperTestAccess } from './disruptions.mapper.testable';

describe('disruptionsBaseMapper', () => {
	const testDataBuilder = new DisruptionViewModelsTestBuilder();
	let baseNode: IDisruptionNode;
	let mapper: DisruptionsMapperTestAccess;

	beforeEach(() => {
		baseNode = testDataBuilder.createIDisruptionNode();
		mapper = new DisruptionsMapperTestAccess();
	});


	it('should decode id', () => {
		const intId = '1';
		const type = 'blah';
		baseNode.id = btoa(`${type}:${intId}`);
		const id = mapper.decodeBase64Id(baseNode.id);
		expect(id).toBe(intId);
	});


	it('should give blank summary of stops', () => {
		const dummyImpact = testDataBuilder.impactNode();
		const arrayOfImpacts: Array<IDisruptionImpactNodeEdge> = [
			{ cursor: '', node: dummyImpact },
			{ cursor: '', node: dummyImpact }
		];
		const stopsSummary = mapper.getStopsSummary(arrayOfImpacts);

		expect(stopsSummary).toBe('');
	});

	it('should set as All Services when no specific services', () => {
		const servicesAffected =  mapper.getServicesAffected(baseNode.impact.edges);
		expect(servicesAffected).toEqual('All services');
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

		it('should give summary of services', () => {
			const servicesAffected =  mapper.getServicesAffected(baseNode.impact.edges);
			expect(servicesAffected).toBe('Bus: Busway A');
		});


		it('should give summary of stops', () => {
			const stopsSummary =  mapper.getStopsSummary(baseNode.impact.edges);
			expect(stopsSummary).toBe('Mill Street, High Street');
		});

	});

	describe('validityPeriods', () => {
		it('should show as no end date when open ended', () => {
			const duration = mapper.getDuration(baseNode.validityPeriod, true);
			expect(duration).toBe('No end date');
		});

		it('should calculate 5 days over whole period', () => {
			const duration = mapper.getDuration(baseNode.validityPeriod, false);
			expect(duration).toBe('5 days');
		});

		it('should calculate 3 days when using final date', () => {
			const duration = mapper.getDuration(baseNode.validityPeriod.slice(0, 1), false);
			expect(duration).toBe('3 days');
		});

		it('should calculate 1 day when using end date', () => {
			const duration = mapper.getDuration(baseNode.validityPeriod.slice(1, 2), false);
			expect(duration).toBe('a day');
		});
	});
});
