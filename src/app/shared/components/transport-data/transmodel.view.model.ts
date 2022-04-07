import { IRestrictionEnum } from '../../../../generated/graphql';
import { Feature } from 'geojson';

export interface TransModelStopsViewModel {
	displayName: string;
	featureName: string;
	entityId: string;
	atcoCode: string;
	stopType?: string;
	lat: number;
	lon: number;
	lineIds?: string[];
	selected: boolean;
	features?: Feature[];
}

export interface TransModelLineViewModel {
	name: string;
	featureName: string;
	entityId: string;
	boundingBox: string;
	operatorEntityIds: string[];
	features?: Feature[];
	selected: boolean;
	type?: IRestrictionEnum;
}
