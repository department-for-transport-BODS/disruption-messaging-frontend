import { Injectable } from '@angular/core';
import { ILineGeoJsonType, ITransModelLineType, ITransModelStopType } from '../../../../generated/graphql';
import { TransModelLineViewModel, TransModelStopsViewModel } from './transmodel.view.model';
import { Feature, FeatureCollection, Point } from '../map/disruptions-map.geojson.classes';
import { Feature as IFeature } from 'geojson';

@Injectable({
	providedIn: 'root'
})
export class TransModelLineViewMapper {
	constructor() {}

	private static mapFeatures(features: IFeature[], lineProps): IFeature[] {
		if (!features) {
			return [];
		}
		features.forEach(feature => {
			if (feature.geometry.type === 'MultiLineString') {
				// Geojson for this line. Enrich the properties
				feature.properties = { ...lineProps };
			}
		});
		return features as IFeature[];
	}

	static isValidCoordinates(lat, lon) {
		if (lat < -90 || lat > 90) {
			return false;
		} else if (lon < -90 || lon > 90) {
			return false;
		}
		return true;
	}

	static toTransModelLineViewModel(line: ITransModelLineType): TransModelLineViewModel {
		const viewModel = {
			entityId: line.entityId,
			name: line.name,
			featureName: line.featureName,
			boundingBox: line.boundingBox,
			operatorEntityIds: line.operatorEntityIds,
			selected: false
		} as TransModelLineViewModel;
		viewModel.features = TransModelLineViewMapper.mapFeatures(line.features as IFeature[], viewModel);
		return viewModel;
	}

	static getStops(line: ITransModelLineType): TransModelStopsViewModel[] {
		const stops = [];
		if (line.features) {
			line.features.map(feature => {
				if (feature.geometry.type === 'Point') {
					const stop = TransModelStopViewMapper.featureToViewModel(feature);
					stop.lineIds.push(line.entityId);
					stops.push(stop);
				}
			});
		}
		return stops;
	}

	static toLineGeoJson(line: TransModelLineViewModel): IFeature[] {
		if (line) {
			return line.features
				.filter(
					feature => feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'
				)
				.map(feature => {
					feature.properties.selected = line.selected;
					return feature;
				});
		}
	}

	static toLinesGeoJson(lines: TransModelLineViewModel[]): FeatureCollection {
		const geoJson = new FeatureCollection('lines', []);
		if (lines) {
			lines.map(line => geoJson.features.push(...TransModelLineViewMapper.toLineGeoJson(line)));
		}
		return geoJson;
	}
}

@Injectable({
	providedIn: 'root'
})
export class TransModelStopViewMapper {
	static toTransModelStopViewModel(stop: ITransModelStopType): TransModelStopsViewModel {
		if (!stop) { return null; }

		let atcoCode = stop.atcoCode;
		return {
			displayName: `${stop.featureName} (${atcoCode})`,
			featureName: stop.featureName,
			entityId: stop.entityId,
			atcoCode,
			lat: parseFloat(stop.lat),
			lon: parseFloat(stop.lon),
			lineIds: [],
			selected: false,
			features: (stop.features as IFeature[]) || []
		};
	}

	static toStopsGeoJson(stops: TransModelStopsViewModel[]): FeatureCollection {
		const stopsGeoJson = new FeatureCollection('stops', []);
		if (stops) {
			stops.forEach(stop => {
				if (TransModelLineViewMapper.isValidCoordinates(stop.lat, stop.lon)) {
					delete stop.features;
					stopsGeoJson.features.push(new Feature(new Point([stop.lon, stop.lat]), { ...stop }));
				}
			});
		}
		return stopsGeoJson;
	}

	static toStopGeoJson(stop: TransModelStopsViewModel): IFeature {
		return new Feature(new Point([stop.lon, stop.lat]), { ...stop });
	}

	static featureToViewModel(feature: ILineGeoJsonType): TransModelStopsViewModel {
		const atcoCode = feature.properties.atco_code;
		return {
			displayName: `${feature.properties.feature_name} (${atcoCode})`,
			featureName: feature.properties.feature_name,
			entityId: feature.properties.id,
			atcoCode,
			lat: parseFloat(feature.geometry.coordinates[1]),
			lon: parseFloat(feature.geometry.coordinates[0]),
			lineIds: [],
			selected: false,
			features: [feature] as IFeature[]
		};
	}
}
