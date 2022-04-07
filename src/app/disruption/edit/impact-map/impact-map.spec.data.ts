import {
	TransModelLineViewModel,
	TransModelStopsViewModel
} from '../../../shared/components/transport-data/transmodel.view.model';
import {
	TransModelLineViewMapper,
	TransModelStopViewMapper
} from '../../../shared/components/transport-data/transmodel.view.mapper';

export const operators = [
	{
		code: 'codey',
		name: 'Stagecoach',
		entityId: 'OOP1',
		lines: {
			entityId: 'LIN007',
			displayName: 'Stokesy'
		}
	}
];

export const stopViewModel: TransModelStopsViewModel = {
	displayName: 'stop-1 (1111)',
	featureName: 'stop-1',
	entityId: 'ST1111',
	atcoCode: '1111',
	lat: 2.0,
	lon: 1.0,
	selected: false,
	lineIds: ['LIN007']
};

export const stops: TransModelStopsViewModel[] = [
	{
		...stopViewModel
	}
];

export const stopsGeoJson = TransModelStopViewMapper.toStopsGeoJson(stops);

export const line07 = {
	name: 'Ben',
	featureName: 'Stokes',
	entityId: 'LIN007',
	boundingBox: null,
	features: [
		{
			type: 'Feature',
			properties: {
				id: 'LIN007',
				feature_name: 'line 007',
				main_feature: 'true'
			},
			geometry: {
				type: 'MultiLineString',
				coordinates: [[[0.0, 1.0], [1.0, 2.0]]]
			}
		},
		{
			type: 'Feature',
			properties: {
				id: 'stop1',
				feature_name: 'A stop on line 007'
			},
			geometry: {
				type: 'Point',
				coordinates: [1.0, 2.0]
			}
		}
	],
	operatorEntityIds: ['OOP1'],
	selected: true
} as TransModelLineViewModel;

export const line08 = {
	name: 'Ben',
	featureName: 'Stokes',
	entityId: 'LIN008',
	boundingBox: null,
	features: [
		{
			type: 'Feature',
			properties: {
				id: 'LIN008',
				feature_name: 'line 008',
				main_feature: 'true'
			},
			geometry: {
				type: 'MultiLineString',
				coordinates: [[[0.0, 1.0], [1.0, 2.0]]]
			}
		},
		{
			type: 'Feature',
			properties: {
				id: 'stop2',
				feature_name: 'A stop on line 008'
			},
			geometry: {
				type: 'Point',
				coordinates: [1.0, 1.0]
			}
		}
	],
	operatorEntityIds: ['OOP2'],
	selected: true
} as TransModelLineViewModel;

export const lines = [line07];
export const linesGeoJson = TransModelLineViewMapper.toLinesGeoJson(lines);
export const lineStopsGeoJson = TransModelStopViewMapper.toStopsGeoJson(TransModelLineViewMapper.getStops(line07));
