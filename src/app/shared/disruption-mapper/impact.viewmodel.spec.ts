import { ImpactViewModel } from './impact.viewmodel';
import { IDisruptionImpactNode, IStopPointNode, IStopPointNodeEdge } from 'src/generated/graphql';
import { DisruptionViewModelsTestBuilder } from './disruption-viewmodels.test-builder';
import { IStopPointType } from 'src/generated/enum-overrides';

describe('ImpactViewModel', () => {
	const builder = new DisruptionViewModelsTestBuilder();
	let node: IDisruptionImpactNode;
	let vm: ImpactViewModel;

	beforeEach(() => {
		node = builder.impactNode();

		vm = new ImpactViewModel(node);
	});

	it('should map id', () => {
		expect(vm.id).toBe('1302');
	});

	it('should map name', () => {
		expect(vm.name).toBe(node.name);
	});

	it('should map advice', () => {
		expect(vm.advice).toBe(node.advice);
	});

	it('should map severity', () => {
		expect(vm.severity).toBe('Very Slight');
	});

	it('should map mode', () => {
		expect(vm.mode).toBe('Bus');
	});

	it('should map type', () => {
		node.lines = null;
		node.operators = null;
		const model = new ImpactViewModel(node);
		expect(model.type).toBe('Network');
	});

	it('should map operator type', () => {
		node.lines = null;
		const model = new ImpactViewModel(node);
		expect(model.type).toBe('Operator');
	});

	it('should map Service type', () => {
		node.operators = null;
		const model = new ImpactViewModel(node);
		expect(model.type).toBe('Service');
	});

	it('should map delay', () => {
		expect(vm.delay).toBe(node.delay);
	});

	it('should map operatorId', () => {
		expect(vm.operatorIds).toEqual(node.operators.edges.map((op) => op.node.id));
	});

	it('should map empty operator', () => {
		node.operators = null;
		const model = new ImpactViewModel(node);

		expect(model.operatorIds).toEqual([]);
		expect(model.operators).toEqual([]);
	});

	it('should map operator name', () => {
		expect(vm.operators).toEqual(node.operators.edges.map((op) => op.node.name));
	});

	it('should map lineId', () => {
		expect(vm.lineIds).toEqual(node.lines.edges.map((line) => line.node.id));
	});

	it('should map empty line', () => {
		node.lines = null;
		const model = new ImpactViewModel(node);

		expect(model.lines).toEqual([]);
		expect(model.lineIds).toEqual([]);
	});

	it('should map line name', () => {
		expect(vm.lines).toEqual(node.lines.edges.map((line) => line.node.name));
	});

	it('should map stops common name', () => {
		const stop: IStopPointNodeEdge = {
			cursor: '',
			node: {
				commonName: 'Common As',
				id: '1',
				type: IStopPointType.A_1
			} as IStopPointNode
		};
		node.stops.edges.push(stop);
		node.lines = null;
		node.operators = null;
		const model = new ImpactViewModel(node);

		expect(model.stopNames).toEqual(['Common As']);
		expect(model.type).toBe('Stops');
	});
});
