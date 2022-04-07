import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, HostListener } from '@angular/core';
import {
	EventData,
	LngLat,
	LngLatBounds,
	LngLatBoundsLike,
	LngLatLike,
	Map
} from 'mapbox-gl';
import { Feature, FeatureCollection } from '../../../shared/components/map/disruptions-map.geojson.classes';
import { MultiLineString, Point } from 'geojson';
import { ImpactMapService } from './impact-map.service';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import OsGridRef from 'geodesy/osgridref';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { drawStyles } from './impact-map.draw.style';
import { TransModelStore } from '../../../shared/components/transport-data/transmodel.store';
import { ITransModelAdminAreaListType } from '../../../../generated/graphql';
import { assignIn, values } from 'lodash';
import { area } from '@turf/turf';


const SELECT_ALL_FETCH_LIMIT = 100;
const MAP_DRAW_AREA_MAX = 30000000; // sq. metres

enum ImpactType {
	Service = 1,
	Stop = 2,
}


@Component({
	selector: 'dm-impact-map',
	templateUrl: './impact-map.component.html',
	styleUrls: ['./impact-map.component.scss']
})
export class ImpactMapComponent implements OnInit, OnDestroy {

	map: Map;
	draw: any;
	centre: number[] = [-1.8852274, 54.221642]; // Somewhere in the middle of north.
	hoveredStop: Feature = null;
	hoveredLines: string[] = [];
	hoveredLineCoordinates: LngLatLike = null;
	initialZoom = 6;
	maxZoom = 17;
	maxAutoZoom = 12;
	showStopsMinZoom = 11;
	lines: FeatureCollection;
	stops: FeatureCollection;
	subscriptions: Subscription[] = [];
	boxId: string;
	boundingBox: LngLatBounds;
	maxBounds: LngLatBoundsLike = [
		[-10.880017, 49.766809], // [west, south]
		[3.6320205, 61.464592]  // [east, north]
	];
	selectAll = false;
	searchedCoordinates: LngLat;
	warning = '';
	noResultsFound = false;

	@Input()
	impactType: ImpactType;

	constructor(
		private mapService: ImpactMapService,
		private spinner: NgxSpinnerService,
		private cdr: ChangeDetectorRef,
		private transModelStore: TransModelStore) {
	}

	private calculateAdminAreaBoundingBox(adminAreas: ITransModelAdminAreaListType[]): LngLatBounds {
		if (!adminAreas || !adminAreas.length) {
			return null;
		}
		const boxCoordinates: LngLatLike[] = [];
		adminAreas.forEach(adminArea => {
			if (adminArea.featureName.startsWith('National')) {
				return;
			}
			const boundingBox = adminArea.boundingBox.split(',');
			let topLeft;
			let bottomRight;
			try {
				topLeft = new OsGridRef(
					parseInt(boundingBox[0], 10), parseInt(boundingBox[1], 10)).toLatLon();
				bottomRight = new OsGridRef(
					parseInt(boundingBox[2], 10), parseInt(boundingBox[3], 10)).toLatLon();
			} catch (e) {
				console.warn('Invalid range for bounding box:', e);
				return;
			}
			boxCoordinates.push([topLeft.lng, topLeft.lat]);
			boxCoordinates.push([bottomRight.lng, bottomRight.lat]);
		});
		if (!boxCoordinates.length) {
			return null;
		}

		return boxCoordinates.reduce((acc, coord) => {
				return acc.extend(new LngLat(coord[0], coord[1]));
			}, new LngLatBounds(boxCoordinates[0], boxCoordinates[0]));
	}

	ngOnInit(): void {
		this.subscriptions.push(
			this.transModelStore.adminAreas$().subscribe(
				adminAreas => this.boundingBox = this.calculateAdminAreaBoundingBox(adminAreas))
		);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
		this.mapService.resetWarning();
	}

	setBoundingBox(data: FeatureCollection) {
		if (!this.map) {
			return;
		}
		const coordinates = [];
		data.features.forEach(feature => {
			const geometry = feature.geometry as Point | MultiLineString;
			switch (geometry.type) {
				case 'Point':
					if (this.impactType === ImpactType.Stop) {
						coordinates.push(geometry.coordinates);
					}
					break;
				case 'MultiLineString':
					if (this.impactType === ImpactType.Service) {
						geometry.coordinates.forEach(l => {
							l.forEach(p => {
								coordinates.push(p);
							});
						});
					}
					break;
			}
		});
		if (coordinates.length === 0) {
			return;
		}
		const box = coordinates.reduce((acc, coord) => {
			return acc.extend(coord);
		}, new LngLatBounds(coordinates[0], coordinates[0]));
		this.map.fitBounds(box.toArray(), {padding: 25, animate: true, maxZoom: this.maxAutoZoom});
	}

	onLoad(e) {
		this.map = e;
		this.setMaxBounds();
		this.centerMap();
		this.setupDrawingTool();
		this.registerEvents();
		this.subscribeToDataUpdates();
	}

	private setMaxBounds() {
		this.map.setMaxBounds(this.maxBounds);
	}

	private centerMap() {
		if (!this.boundingBox) {
			return;
		}
		this.map.fitBounds(this.boundingBox, {padding: 25, animate: true, maxZoom: this.maxAutoZoom});
	}

	private subscribeToDataUpdates() {
		this.subscriptions.push(this.mapService.linesGeoJson$
			.subscribe(lines => {
				this.lines = lines;
				this.spinner.hide();
				this.resetWarning();
			}));
		this.subscriptions.push(this.mapService.stopsGeoJson$
			.subscribe(stops => {
				this.stops = stops;
				this.spinner.hide();
				this.cdr.detectChanges();
				this.resetWarning();
			}));
		this.subscriptions.push(this.mapService.changeZoom$.subscribe(toZoom => {
			if (toZoom) {
				if (toZoom === 'line') {
					this.setBoundingBox(this.lines);
				} else {
					this.setBoundingBox(this.stops);
				}
			}
		}));
		this.subscriptions.push(this.mapService.warning$.subscribe(warning => {
			this.spinner.hide();
			warning ? this.setWarning(warning) : this.resetWarning();
		}));
	}

	private deleteBox() {
		if (this.boxId) {
			try {
				this.draw.delete(this.boxId);
			} catch (error) {
				console.warn('Polygon already deleted.');
			}
			this.boxDeleted();
			this.boxId = null;
		}
	}

	private setupDrawingTool() {
		// Disable dragging of drawn polygon - https://github.com/mapbox/mapbox-gl-draw/issues/667
		const simpleSelectMode = assignIn(MapboxDraw.modes.simple_select, {
			dragMove() {}
		});

		const directSelectMode = assignIn(MapboxDraw.modes.direct_select, {
			dragFeature() {},
			onDrag() {}
		});
		this.draw = new MapboxDraw({
			displayControlsDefault: false,
			modes: {
				...MapboxDraw.modes,
				simple_select: simpleSelectMode,
				direct_select: directSelectMode
			},
			controls: {
				polygon: true,
				trash: true,
				zoom: true
			},
			styles: drawStyles
		});
		this.map.addControl(this.draw, 'top-left');
	}

	private registerEvents() {
		this.map.on('draw.create', box => this.boxCreated(box));
		this.map.on('draw.delete', () => this.boxDeleted());
	}

	private exceedsMaximumArea(draw): boolean {
		if (draw.features.length > 0) {
			const drawnArea = area(draw.features[0]);
			if (drawnArea > MAP_DRAW_AREA_MAX) {
				this.setWarning('Drawn area too big, please draw a smaller area');
				return true;
			}
		}
		return false;
	}

	private boxCreated(draw) {
		if (this.boxId) { this.deleteBox(); }

		this.boxId = draw.features[0].id;

		if (this.exceedsMaximumArea(draw)) {
			return;
		}

		this.spinner.show();
		this.resetWarning();

		const coordinates = draw.features[0].geometry.coordinates[0];
		let bbox = coordinates.reduce((acc, coord) => {
			return acc.extend(coord);
		}, new LngLatBounds(coordinates[0], coordinates[0]));
		bbox = bbox.toArray();

		try {
			this.map.fitBounds(bbox, {padding: 25, animate: true});
			this.mapService.searchAreaStops(draw.features[0]);
		} catch (error) {
			console.log(error);
			this.spinner.hide();
			this.deleteBox();
		}
	}

	private boxDeleted() {
		this.mapService.resetUnselectedLines();
		this.mapService.resetUnselectedStops();
	}

	private ignoreClick(e) {
		// Mapbox will fire events for multiple layers when mouse is clicked on a stop. Ignore the click for
		// the line. The line selection logic will be handled in the stopClick handler if there is
		// also a stop at this co-ordinate.
		const stops = this.map.queryRenderedFeatures(e.point, {layers: ['layer-stops']});
		const selectedStops = this.map.queryRenderedFeatures(e.point, {layers: ['layer-selected-stops']});

		return stops.length || selectedStops.length;
	}

	onStopClick(e: EventData) {
		// Highlight the stop.
		e.originalEvent.cancelBubble = true;
		if (e.features[0].properties.lineIds) {
			e.features[0].properties.lineIds = JSON.parse(e.features[0].properties.lineIds);
		}
		this.mapService.resetWarning();
		this.spinner.show();
		const feature = e.features[0];
		if (feature.properties.selected) {
			// This stop will be un-selected, so ensure we still show the 'Select All' button.
			this.selectAll = false;
		}
		this.impactType === 1 ? this.mapService.stopClicked(feature) : this.mapService.toggleSelected(feature, 'stop');
	}

	onLineClick(e: EventData) {
		if (this.ignoreClick(e)) {
			return;
		}
		this.mapService.resetWarning();

		const features = this.map.queryRenderedFeatures(e.point, {layers: ['layer-lines',  'layer-selected-lines']});
		const lines = {};
		features.forEach(feature => lines[feature.properties.line_id] = feature);
		let select = false;
		values(lines).forEach(line => {
			line.properties.operatorEntityIds = JSON.parse(line.properties.operatorEntityIds);
			if (line.properties.selected) {
				// This line will be un-selected, so ensure we still show the 'Select All' button.
				this.selectAll = false;
			} else {
				select = true;
			}
		});
		this.mapService.selectLines(values(lines), select);
	}

	showStopInfo(e: EventData): void {
		this.map.getCanvas().style.cursor = 'pointer';
		this.hoveredStop = e.features[0];
	}

	hideStopInfo(): void {
		this.map.getCanvas().style.cursor = '';
		this.hoveredStop = null;
	}

	showLineInfo(e: EventData): void {
		this.map.getCanvas().style.cursor = 'pointer';
		const lines = this.map.queryRenderedFeatures(e.point, {layers: ['layer-lines',  'layer-selected-lines']});
		const hoveredLines = new Set();
		lines.forEach(line => hoveredLines.add(line.properties.featureName));
		this.hoveredLines = Array.from(hoveredLines) as any;
		this.hoveredLineCoordinates = e.lngLat;
	}

	hideLineInfo(): void {
		this.map.getCanvas().style.cursor = '';
		this.hoveredLines = [];
		this.hoveredLineCoordinates = null;
	}

	private handleError(e) {
		console.error(e);
		this.spinner.hide();
	}

	private setWarning(warning) {
		this.warning = warning;
	}

	private resetWarning() {
		this.warning = '';
	}

	toggleSelectAll(): void {
		this.selectAll = !this.selectAll;
		if (this.selectAll) {
			this.spinner.show();
			try {
				this.selectAll = this.mapService.selectAll(
					SELECT_ALL_FETCH_LIMIT, this.impactType === ImpactType.Service);
				if (!this.selectAll) {
					this.setWarning(`Limiting selection to ${SELECT_ALL_FETCH_LIMIT} stops.`);
				} else {
					this.resetWarning();
				}
			} catch (e) {
				this.handleError(e);
			}
		} else {
			this.mapService.deSelectAll(this.impactType === ImpactType.Service);
			this.resetWarning();
		}
	}

	drawMarker(event: any) {
		this.searchedCoordinates = event.result.center;
	}

	checkResults(event: any) {
		this.noResultsFound = !event.features.length;
	}

	@HostListener('window:focusout', [])
	handleFocusOut() {
		this.noResultsFound = false;
	}
}
