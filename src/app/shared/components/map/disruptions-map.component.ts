import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
	ChangeDetectionStrategy
} from '@angular/core';
import { Map, LngLatBounds, LngLat, EventData, GeoJSONSource, LngLatBoundsLike } from 'mapbox-gl';
import { Feature, FeatureCollection } from './disruptions-map.geojson.classes';
import { Point } from 'geojson';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
	selector: 'map-popup',
	template: `
		<table class="map-popup__table">
			<tr *ngIf="title">
				<td>Title: </td>
				<td>{{ title }}</td>
			</tr>
			<tr *ngIf="severity">
				<td>Severity: </td>
				<td>{{ severity }}</td>
			</tr>
			<tr *ngIf="stop">
				<td>Stop: </td>
				<td>{{ stop }}</td>
			</tr>
			<tr *ngFor="let line of lines; let i=index">
				<td>Line {{ i + 1 }}: </td>
				<td>{{ line }}</td>
			</tr>
		</table>
	`,
	styleUrls: ['./disruptions-map.component.scss']
})
export class MapPopupComponent {
	@Input() title: string;
	@Input() severity: string;
	@Input() impact: string;
	@Input() stop: string;
	@Input() lines: string[];
}

@Component({
	selector: 'dm-disruptions-map',
	templateUrl: './disruptions-map.component.html',
	styleUrls: ['./disruptions-map.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisruptionsMapComponent implements OnChanges {
	map: Map;
	centre: number[] = [-1.0873, 53.96]; // Middle of York - probably should come from environment.
	hoveredIconData: Feature = null;
	bounds: LngLatBounds = null;

	@Output()
	iconClick = new EventEmitter<EventData>();
	@Input()
	data: FeatureCollection;

	protected setBoundingBox() {
		// Called when either map is loaded or data is loaded. When data loads first
		// return because there is no map yet. There is probably a better way of doing this.
		if (!this.map || !this.data || !this.data.features || this.data.features.length === 0) {
			return;
		}
		// fitBounds property in the template has no effect. So do it here manually.
		const bounds = this.data.features.reduce((acc, feature) => {
			const geometry = feature.geometry as Point;
			if (geometry.coordinates[0] && geometry.coordinates[1]) {
				acc.extend(new LngLat(geometry.coordinates[0], geometry.coordinates[1]));
			}
			return acc;
		}, new LngLatBounds());
		if (this.bounds == null || bounds.toString() != this.bounds.toString()) {
			this.bounds = bounds;
			this.map.fitBounds(
				this.bounds,
				{ padding: 25 }
			);
		}
	}

	constructor(private spinner: NgxSpinnerService) {}

	ngOnChanges(changes: SimpleChanges): void {
		this.data ? this.spinner.hide() : this.spinner.show();
		this.setBoundingBox();
	}

	onLoad(e) {
		this.map = e;
		this.setBoundingBox();
	}

	onClick(e: EventData) {
		if (this.iconClick) {
			this.iconClick.next(e);
		}
		const features = this.map.queryRenderedFeatures(e.point, { layers: ['layer-disruptions'] });
		const geometry = features[0].geometry as Point;
		this.map.easeTo({
			center: new LngLat(geometry.coordinates[0], geometry.coordinates[1])
		});
	}

	onMouseEnter(e: EventData): void {
		this.map.getCanvas().style.cursor = 'pointer';
		this.hoveredIconData = e.features[0];
	}

	onMouseLeave(): void {
		this.map.getCanvas().style.cursor = '';
		this.hoveredIconData = null;
	}

	onClusterClick(e: EventData): void {
		const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
		const geometry = features[0].geometry as Point;
		const clusterId = features[0].id as number;
		const dataSource = this.map.getSource('disruptions') as GeoJSONSource;
		dataSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
			if (err) {
				return;
			}
			this.map.easeTo({
				center: new LngLat(geometry.coordinates[0], geometry.coordinates[1]),
				zoom
			});
		});
	}
}
