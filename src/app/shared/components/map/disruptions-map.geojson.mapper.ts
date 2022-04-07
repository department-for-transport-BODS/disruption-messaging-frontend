import { Injectable } from '@angular/core';
import {
	DisruptionMapModeIcon,
	DisruptionMapSeverityColour,
	Feature,
	FeatureCollection,
	Point
} from './disruptions-map.geojson.classes';
import {
	IDisruptionNodeConnection,
} from '../../../../generated/graphql';
import { DisruptionMapperBase } from '../../disruption-mapper/disruptions.mapper';

@Injectable({
	providedIn: 'root'
})
export class GeojsonMapper extends DisruptionMapperBase {

	static isValidCoordinates(lat, lon) {
		if (lat < -90 || lat > 90) {
			return false;
		} else if (lon < -90 || lon > 90) {
			return false;
		}
		return true;
	}

	getDisruptionGeoJson(disruptions: IDisruptionNodeConnection): FeatureCollection {
		const mapData = new FeatureCollection('disruptions', []);

		disruptions.edges.forEach(disruption =>
			disruption.node.impact.edges.forEach(impact =>
				impact.node.stops.edges.forEach(stop => {
					if (GeojsonMapper.isValidCoordinates(stop.node.latitude, stop.node.longitude)) {
						mapData.features.push(
							new Feature(new Point([stop.node.longitude, stop.node.latitude]), {
								id: this.decodeBase64Id(disruption.node.id),
								encodedId: disruption.node.id,
								title: disruption.node.title,
								severity: disruption.node.severity,
								isLive: disruption.node.isLive,
								stop: stop.node.commonName,
								iconColour: DisruptionMapSeverityColour[disruption.node.severity],
								icon: DisruptionMapModeIcon[impact.node.mode] + '-tfn'
							})
						);
					}
				})
			)
		);
		return mapData;
	}
}
