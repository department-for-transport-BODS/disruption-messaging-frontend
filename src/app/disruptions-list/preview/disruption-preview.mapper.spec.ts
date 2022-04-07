import { DisruptionViewModelsTestBuilder } from '../../shared/disruption-mapper/disruption-viewmodels.test-builder';
import {
	IDisruptionNode,
	IDisruptionImpactNodeEdge,
	IValidityPeriodType,
	ILogEntryAction
} from 'src/generated/graphql';
import { IDisruptionReason } from 'src/generated/enum-overrides';
import { DisruptionPreviewViewModel } from './disruption-preview.viewmodel';
import { DisruptionPreviewMapper } from './disruption-preview.mapper';
import * as moment from 'moment';

describe('disruptionPreviewModelMapper', () => {
	const testDataBuilder = new DisruptionViewModelsTestBuilder();
	const mapper = new DisruptionPreviewMapper();
	let baseNode: IDisruptionNode;

	beforeAll(() => {
		baseNode = testDataBuilder.createIDisruptionNode();
	});

	it('should set the description', () => {
		const expectedDescription = 'New Description from summary test';
		baseNode.description = expectedDescription;
		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.description).toBe(expectedDescription);
	});

	it('should set is template', () => {
		baseNode.isTemplate = true;
		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.isTemplate).toBeTruthy();
	});

	it('should not failed when description not set', () => {
		baseNode.description = null;
		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.description).toBeFalsy();
	});

	it('should set the reason', () => {
		const expectedReason = 'Incident';
		baseNode.reason = 'A_7' as IDisruptionReason;
		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.reason).toBe(expectedReason);
	});

	it('should set the maximum delay', () => {
		const expectedDelay = '100';
		const impactWithDelay1 = testDataBuilder.createImpactNodeWithDelay(1);
		const impactWithDelay2 = testDataBuilder.createImpactNodeWithDelay(2);
		const impactWithDelay50 = testDataBuilder.createImpactNodeWithDelay(50);
		const impactWithDelay100 = testDataBuilder.createImpactNodeWithDelay(100);
		const arrayOfImpacts: Array<IDisruptionImpactNodeEdge> = [
			{ cursor: '', node: impactWithDelay1 },
			{ cursor: '', node: impactWithDelay2 },
			{ cursor: '', node: impactWithDelay50 },
			{ cursor: '', node: impactWithDelay100 }
		];
		baseNode.impact.edges = arrayOfImpacts;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.delay).toBe(expectedDelay);
	});

	it('should set the delay to not set when none.', () => {
		const expectedDelay = 'Not set';
		const arrayOfImpacts: Array<IDisruptionImpactNodeEdge> = [];
		baseNode.impact.edges = arrayOfImpacts;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.delay).toBe(expectedDelay);
	});

	it('should get comma seperated list of operators.', () => {
		const expectedOperators = 'Arriva, Stagecoach';
		const arriva = testDataBuilder.createImpactNodeWithOperator('Arriva');
		const stagecoach = testDataBuilder.createImpactNodeWithOperator('Stagecoach');
		const arrayOfImpacts: Array<IDisruptionImpactNodeEdge> = [
			{ cursor: '', node: arriva },
			{ cursor: '', node: stagecoach }
		];
		baseNode.impact.edges = arrayOfImpacts;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.operators).toBe(expectedOperators);
	});

	it('should calculate duration between validity', () => {
		const validityPeriods: IValidityPeriodType[] = [
			{
				id: '1',
				startDate: '2019-01-01',
				endDate: '2019-01-03',
				startTime: '01:21:00',
				endTime: '02:00:00',
				days: [5],
				disruption: baseNode
			},
			{
				id: '2',
				startDate: '2019-01-05',
				endDate: '2019-01-07',
				startTime: '14:32:00',
				endTime: '13:20:00',
				days: [1, 2, 3],
				disruption: baseNode
			}
		];

		baseNode.validityPeriod = validityPeriods;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.duration).toBe('6 days');
	});

	it('should setup the validity periods', () => {
		const validityPeriods: IValidityPeriodType[] = [
			{
				id: '1',
				startDate: '27/01/2019',
				endDate: '05/02/2019',
				startTime: '06:00:00',
				endTime: '08:00:00',
				days: [0, 1, 5],
				disruption: baseNode
			},
			{
				id: '2',
				startDate: '29/02/2019',
				endDate: '01/04/2019',
				startTime: '09:00:00',
				endTime: '11:00:00',
				days: [1, 2, 3],
				disruption: baseNode
			}
		];

		baseNode.validityPeriod = validityPeriods;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.validityPeriods.length).toBe(validityPeriods.length);
	});

	it('should map validity period start and end datetimes correctly', () => {
		const validityPeriods: IValidityPeriodType[] = [
			{
				id: '1',
				startDate: '2019-01-27',
				endDate: '2019-02-05',
				startTime: '06:00:00',
				endTime: '08:05:12',
				days: [0, 1, 5],
				disruption: baseNode
			}
		];

		baseNode.validityPeriod = validityPeriods;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);
		const actual = viewModel.validityPeriods[0];

		expect(actual.startDate).toBe('Sun 27 Jan 19');
		expect(actual.startTime).toBe('06:00');
		expect(actual.endDate).toBe('Tue 5 Feb 19');
		expect(actual.endTime).toBe('08:05');
	});

	it('should map validity period days', () => {
		const validityPeriods: IValidityPeriodType[] = [
			{
				id: '1',
				startDate: '27/01/2019',
				endDate: '05/02/2019',
				startTime: '06:00:00',
				endTime: '08:00:00',
				days: [0, 1, 5],
				disruption: baseNode
			}
		];

		baseNode.validityPeriod = validityPeriods;

		const viewModel: DisruptionPreviewViewModel = mapper.getDisruptionPreview(baseNode);

		expect(viewModel.validityPeriods[0].days).toEqual(validityPeriods[0].days);
	});
});
