import { Injectable } from '@angular/core';
import { Feature, FeatureCollection, Point } from '../../../shared/components/map/disruptions-map.geojson.classes';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	TransModelLineViewModel,
	TransModelStopsViewModel
} from '../../../shared/components/transport-data/transmodel.view.model';
import { map, take } from 'rxjs/operators';
import {
	TransModelLineViewMapper,
	TransModelStopViewMapper
} from '../../../shared/components/transport-data/transmodel.view.mapper';
import { TransModelService } from '../../../shared/components/transport-data/transmodel.service';
import { keys, values, has, findIndex } from 'lodash';
import { cloneDeep } from 'lodash';
import { LatLon } from 'geodesy/osgridref';
import { Polygon } from 'geojson';
import { inside } from '@turf/turf';


interface Dictionary<T> {
	[Key: string]: T;
}

@Injectable({
	providedIn: 'root'
})
export class ImpactMapService {
	linesSubject = new BehaviorSubject<TransModelLineViewModel[]>([]);
	stopsSubject = new BehaviorSubject<TransModelStopsViewModel[]>([]);
	lines: Dictionary<TransModelLineViewModel>;
	stops: Dictionary<TransModelStopsViewModel>;
	allLines: Dictionary<TransModelLineViewModel>;
	servicePatterns: Dictionary<Set<string>>;
	warningSubject = new BehaviorSubject<string>(null);
	selectedStops: Dictionary<TransModelStopsViewModel>;
	changeZoomSubject = new BehaviorSubject<string>(null);

	constructor(private transModelService: TransModelService) {
		this.lines = {};
		this.stops = {};
		this.servicePatterns = {};
		this.selectedStops = {};
	}

	private notify(type) {
		if (type === 'stop') {
			this.stopsSubject.next(values(this.stops));
		} else {
			this.linesSubject.next(values(this.lines));
		}
	}

	private notifyAll() {
		this.notify('stop');
		this.notify('line');
	}

	private toggleLine(line: TransModelLineViewModel) {
		if (line.entityId in this.servicePatterns) {
			// If this line is fetched as a part of selecting a stop, all service patterns for that line
			// are available.
			this.servicePatterns[line.entityId].forEach(id => (this.lines[id].selected = !line.selected));
		} else {
			// Otherwise, on editing an impact, service pattern info is not available.
			this.lines[line.entityId].selected = !line.selected;
		}
	}

	private selectLine(line: Feature, select = true) {
		if (line.properties.entityId in this.servicePatterns) {
			// If this line is fetched as a part of selecting a stop, all service patterns for that line
			// are available.
			this.servicePatterns[line.properties.entityId].forEach(id => (this.lines[id].selected = select));
		} else {
			// Otherwise, on editing an impact, service pattern info is not available.
			this.lines[line.properties.entityId].selected = select;
		}
	}

	selectLines(lines: Feature[], select = true) {
		lines.forEach(line => this.selectLine(line, select));
		this.notify('line');
	}

	private toggleStop(stop) {
		this.stops[stop.entityId].selected = !this.stops[stop.entityId].selected;
	}

	raiseWarning(warning: string) {
		this.warningSubject.next(warning);
	}

	resetWarning() {
		this.warningSubject.next(null);
	}

	toggleSelected(feature: Feature, type = 'line') {
		type === 'stop' ? this.toggleStop(feature.properties) : this.toggleLine(feature.properties as TransModelLineViewModel);
		this.notify(type);
	}

	setSelectedStops(stops: TransModelStopsViewModel[]) {
		if (!stops) {
			return;
		}
		keys(this.selectedStops).forEach(stopId => {
			if (has(this.stops, stopId)) {
				this.stops[stopId].selected = false;
			}
		});
		this.selectedStops = {};
		stops.forEach(stop => {
			stop.selected = true;
			this.stops[stop.entityId] = stop;
			this.selectedStops[stop.entityId] = stop;
		});
		this.notify('stop');
	}

	addLine(line: TransModelLineViewModel) {
		line.selected = true;
		this.lines[line.entityId] = line;
		this.notify('line');
		this.changeZoomSubject.next('line');
	}

	removeLine(line: TransModelLineViewModel) {
		if (has(this.servicePatterns, line.entityId) || has(this.lines, line.entityId)) {
			// impact component form selector won't have an updated selected value (since it takes the initial values
			// from allLines list and will re-use those object values when removing lines.
			line.selected = true;
			this.toggleLine(line);
			keys(this.stops).forEach(stopId => {
				const lineIds = this.stops[stopId].lineIds.filter(lineId => lineId !== line.entityId);
				if (!lineIds.length) {
					this.stops[stopId].selected = false;
				}
			});
			this.notify('stop');
			this.notify('line');
			this.changeZoomSubject.next('line');
		}
	}

	setLines(lines: TransModelLineViewModel[]) {
		this.lines = {};
		lines.forEach(line => {
			if (line) {
				line.selected = true;
				this.lines[line.entityId] = line;
			}
		});
		this.notify('line');
		this.changeZoomSubject.next('line');
	}

	setAllLines(lines: TransModelLineViewModel[]) {
		this.allLines = {};
		lines.forEach(line => {
			this.allLines[line.entityId] = line;
		});
	}

	setStops(stops: TransModelStopsViewModel[]) {
		this.stops = {};
		stops.forEach(stop => {
			this.stops[stop.entityId] = stop;
			if (has(this.selectedStops, stop.entityId)) {
				this.stops[stop.entityId].selected = true;
			}
		});
		this.notify('stop');
		this.changeZoomSubject.next('stop');
	}

	searchAreaStops(polyFeature: Feature) {
		const geometry = polyFeature.geometry as Polygon;
		const coordinates = geometry.coordinates[0];
		const polygon = coordinates.map(coord => {
			// @ts-ignore
			const point = new LatLon(coord[1], coord[0]).toOsGrid();
			return {
				easting: point.easting,
				northing: point.northing
			};
		});
		this.transModelService
			.searchAreaStops(polygon)
			.pipe(take(1))
			.subscribe(stops => {
				stops.map(stop => {
					const stopFeature = new Point([stop.lon, stop.lat]);
					if (!this.stops[stop.entityId] && inside(stopFeature, geometry)) {
						this.stops[stop.entityId] = stop;
					}
				});
				this.stopsSubject.next(values(this.stops));
				this.changeZoomSubject.next('stop');
			});
	}

	private mapLinesForStop(stop, selectAll = false) {
		const lineIds = {};
		let warnings = false;
		stop.features.forEach(feature => {
			if (feature && feature.geometry && feature.geometry.type === 'LineString') {
				const id = feature.properties.id;
				const lineId = feature.properties.line_id;
				if (!has(this.allLines, lineId)) {
					console.warn('Error: line information not available when selecting stop.');
					warnings = true;
				} else {
					const lineProps = cloneDeep(this.allLines[lineId]);
					lineProps.selected = selectAll;
					keys(lineProps)
						.filter(p => p !== 'features')
						.forEach(elem => (feature.properties[elem] = lineProps[elem]));
					if (lineId in this.lines) {
						// The information about this line will be stored as its service pattern id.
						delete this.lines[lineId];
					}
					this.lines[id] = lineProps;
					if (!(lineId in this.servicePatterns)) {
						this.servicePatterns[lineId] = new Set();
					}
					this.servicePatterns[lineId].add(id);
					if (findIndex(this.lines[id].features, f => f.id === feature.id) === -1) {
						this.lines[id].features.push(feature);
					}
					lineIds[lineId] = lineId;

					this.stops[stop.entityId].selected = true;
					this.stops[stop.entityId].lineIds = values(lineIds);
				}
			}
		});
		return warnings;
	}

	populateLinesFromStopChange(stop: TransModelStopsViewModel) {
		this.transModelService
				.stop$(stop.entityId)
				.pipe(take(1))
				.subscribe(s => {
					if (!s.features.length) {
						this.raiseWarning(`Cannot select stop, stop '${stop.featureName}' does not have any associated services.`);
						return;
					}
					if (this.mapLinesForStop(s, true)) {
						this.raiseWarning(`Cannot get service for stop '${stop.featureName}', the service may be outside your administrative area`);
						return;
					}
					this.notifyAll();
				});
	}


	stopClicked(feature: Feature): boolean {
		const stop = feature.properties as TransModelStopsViewModel;
		if (!has(this.stops, stop.entityId) ||
			(!this.stops[stop.entityId].selected && !this.stops[stop.entityId].lineIds.length)) {
			this.populateLinesFromStopChange(stop);
		} else {
			this.toggleSelected(feature, 'stop');
		}
		return true;
	}

	resetMapData() {
		this.lines = {};
		this.stops = {};
		this.selectedStops = {};
		this.notify('line');
		this.notify('stop');
	}

	resetUnselectedLines() {
		keys(this.lines).forEach(lineId => {
			if (!this.lines[lineId].selected) {
				this.lines[lineId].features.forEach(feature => {
					if (feature.geometry.type === 'Point') {
						if (has(this.stops[feature.properties.id])) {
							delete this.stops[feature.properties.id];
						}
					}
				});
				delete this.lines[lineId];
			}
		});
		this.notify('line');
		this.notify('stop');
	}

	resetUnselectedStops() {
		keys(this.stops).forEach(stopId => {
			if (!this.stops[stopId].selected) {
				delete this.stops[stopId];
			}
		});
		this.notify('stop');
	}

	selectAll(limit: number = 100, lines = true): boolean {
		const selectedStopIds: string[] = [];
		const isLimited = keys(this.stops).some((stopId) => {
			if (!this.stops[stopId].selected) {
				// Lines will be selected when line information is fetched below.
				if (!lines) { this.stops[stopId].selected = true; }
				if (!this.stops[stopId].lineIds.length) {
					selectedStopIds.push(stopId);
				} else {
					this.stops[stopId].selected = true;
				}
				if (selectedStopIds.length > limit) {
					return true;
				}
			}
			if (this.stops[stopId].lineIds.length && lines) {
				this.stops[stopId].lineIds.forEach(lineId => {
					if (lineId in this.servicePatterns) {
						this.servicePatterns[lineId].forEach(id => {
							if (id in this.lines) { this.lines[id].selected = true; }
						});
					}
				});
			}
		});
		let warnings = false;
		if (selectedStopIds.length && lines) {
			this.transModelService.stops$(selectedStopIds.slice(0, limit)).subscribe(
				stops => {
					stops.map(stop => {
						if (!stop.features.length) {
							warnings = true;
						} else {
							warnings = this.mapLinesForStop(stop, true);
						}
					});
					this.notifyAll();
					if (warnings) {
						this.raiseWarning(
							`Unable to select stops as they either have no associated services
							or those services are outside your administrative area`);
						}
				}, (error) => console.log(error));
		} else {
			lines ? this.notifyAll() : this.notify('stop');
		}
		return !isLimited;
	}

	deSelectAll(lines = false) {
		keys(this.stops).forEach(stopId => {
			if (this.stops[stopId].selected) {
				this.stops[stopId].selected = false;
			}
		});
		if (lines) {
			keys(this.lines).forEach(lineId => {
				if (this.lines[lineId].selected) {
					this.lines[lineId].selected = false;
				}
			});
			this.notifyAll();
		} else {
			this.notify('stop');
		}
	}

	get stops$(): Observable<TransModelStopsViewModel[]> {
		return this.stopsSubject.asObservable();
	}

	get selectedStops$(): Observable<TransModelStopsViewModel[]> {
		return this.stopsSubject.asObservable().pipe(map(stops => stops.filter(stop => stop.selected === true)));
	}

	get selectedLines$(): Observable<TransModelLineViewModel[]> {
		return this.linesSubject.asObservable().pipe(map(lines => lines.filter(line => line.selected === true)));
	}

	get stopsGeoJson$(): Observable<FeatureCollection> {
		return this.stopsSubject.asObservable().pipe(map(stops => TransModelStopViewMapper.toStopsGeoJson(stops)));
	}

	get linesGeoJson$(): Observable<FeatureCollection> {
		return this.linesSubject.asObservable().pipe(map(lines => TransModelLineViewMapper.toLinesGeoJson(lines)));
	}

	get changeZoom$(): Observable<string> {
		return this.changeZoomSubject.asObservable();
	}

	get warning$(): Observable<string> {
		return this.warningSubject.asObservable();
	}
}
