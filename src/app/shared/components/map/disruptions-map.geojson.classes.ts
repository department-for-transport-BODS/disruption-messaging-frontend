import {
	Feature as IFeature,
	FeatureCollection as IFeatureCollection,
	MultiPoint as IMultiPoint,
	Point as IPoint,
	Position,
	Geometry,
	GeoJsonProperties,
	MultiLineString as IMultiLineString,
	LineString as ILineString,
} from 'geojson';

export class MultiPoint  implements IMultiPoint {
	type: 'MultiPoint';
	constructor(public coordinates: Array<Position>) {
		this.coordinates = coordinates;
		this.type = 'MultiPoint';
	}
}

export class MultiLineString  implements IMultiLineString {
	type: 'MultiLineString';
	constructor(public coordinates: Array<Array<Position>>) {
		this.coordinates = coordinates;
		this.type = 'MultiLineString';
	}
}

export class LineString  implements ILineString {
	type: 'LineString';
	constructor(public coordinates: Array<Position>) {
		this.coordinates = coordinates;
		this.type = 'LineString';
	}
}


export class Point implements IPoint {
	type: 'Point';
	constructor(public coordinates: Position) {
		this.coordinates = coordinates;
		this.type = 'Point';
	}
}

export class Feature implements IFeature {
	type: 'Feature';
	constructor(public geometry: Geometry, public properties: GeoJsonProperties) {
		this.geometry = geometry;
		this.properties = properties;
		this.type = 'Feature';
	}
}

export class FeatureCollection implements IFeatureCollection {
	type: 'FeatureCollection';
	constructor(public name: string, public features: Array<IFeature>) {
		this.name = name;
		this.features = features;
		this.type = 'FeatureCollection';
	}
}


export enum DisruptionMapModeIcon {
	/** Bus */
	A_1 = 'bus',
	/** Tram */
	A_2 = 'tram',
	/** Train */
	A_3 = 'train',
	/** Ferry */
	A_4 = 'ferry'
}

export enum DisruptionMapSeverityColour {
	/** VerySlight */
	'Very Slight' = '#ffb380',
	/** Slight */
	'Slight' = '#ffbf80',
	/** Normal */
	'Normal' = '#ff8000',
	/** Severe */
	'Severe' = '#ff5c33',
	/** Very Severe */
	'Very Severe' = '#ff0000',
	/** Unknown */
	'Unknown' = '#d1d1e0',
	/** No Impact */
	'No Impact' = '#ddffcc',
}
