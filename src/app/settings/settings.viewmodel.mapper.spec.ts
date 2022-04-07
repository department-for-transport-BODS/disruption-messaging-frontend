import { SettingsViewModelMapper } from './settings.viewmodel.mapper';
import { IEnumOverridesObject } from 'src/generated/graphql';

describe('socialViewModelMapper', () => {
	let apiResponse: IEnumOverridesObject[];
	const settingsViewModelMapper = new SettingsViewModelMapper();

	beforeEach(() => {
		apiResponse = [
			{
				id: '1',
				type: 'Bob',
				allValues: ['BillAndBob', 'BobBob', 'BobAndBob'],
				values: ['BillAndBob', 'BobBob']
			},
			{
				id: '2',
				type: 'Severity',
				allValues: ['ATest', 'Unknown', 'MoreValues'],
				values: []
			},
			{
				id: '2',
				type: 'Reason',
				allValues: ['ATest', 'AnotherTestLonger', 'antiClockwise'],
				values: []
			}
		];
	});

	it('should map type name', () => {
		const result = settingsViewModelMapper.toViewModel(apiResponse);
		expect(result[0].type).toEqual(apiResponse[2].type);
		expect(result[1].type).toEqual(apiResponse[0].type);
		expect(result[2].type).toEqual(apiResponse[1].type);
	});

	it('should move reasons to first in the list', () => {
		const result = settingsViewModelMapper.toViewModel(apiResponse);
		expect(result[0].type).toEqual('Reason');
	});

	it('should prettify enum value', () => {
		const result = settingsViewModelMapper.toViewModel(apiResponse);
		expect(result[0].allValues[0]).toEqual('A Test');
		expect(result[0].allValues[1]).toEqual('Another Test Longer');
		expect(result[0].allValues[2]).toEqual('anti Clockwise');
	});

	it('should filter out current values from all', () => {
		const result = settingsViewModelMapper.toViewModel(apiResponse);
		expect(result[1].allValues.length).toEqual(1);
		expect(result[1].allValues[0]).toEqual('Bob And Bob');
	});

	it('should map to graph ql input', () => {
		const result = settingsViewModelMapper.toGraphQLInput([
			{
				type: 'Bob',
				allValues: ['Bill And Bob', 'Bob Bob', 'Bob And Bob'],
				currentValues: ['Bill And Bob', 'Bob Bob']
			}
		]);
		expect(result[0].type).toEqual('Bob');
		expect(result[0].values).toEqual(['BillAndBob', 'BobBob']);
	});
});
