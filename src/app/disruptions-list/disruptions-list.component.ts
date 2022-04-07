import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy, AfterContentChecked } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

import { DisruptionsFilter } from './filter/disruptions-filter.class';
import { DisruptionsFilterParameters } from './filter/disruptions-filter-parameters.class';
import { DisruptionsListService } from './disruptions-list.service';
import { DisruptionsGridDataSource } from './grid/disruptions-grid.datasource';
import { DisruptionsGridComponent } from './grid/disruptions-grid.component';
import { DisruptionsGridService } from './grid/disruptions-grid.service';

import { GeojsonMapper } from '../shared/components/map/disruptions-map.geojson.mapper';
import { FeatureCollection } from '../shared/components/map/disruptions-map.geojson.classes';
import { EventData } from 'mapbox-gl';
import { AuditHistoryService } from '../audit/audit-history.service';
import { ExportService } from './export.service';
import { ExportAllFieldsService } from './export-all-fields.service';

@Component({
	selector: 'dm-disruptions-list',
	templateUrl: './disruptions-list.component.html',
	providers: [GeojsonMapper],
	styleUrls: ['./disruptions-list.component.scss']
})
export class DisruptionsListComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked {
	filter: DisruptionsFilterParameters;
	currentView = 'list';
	mapData$: Observable<FeatureCollection>;
	tableDataSource: DisruptionsGridDataSource;
	@ViewChild('tableComponent', { static: false })
	tableComponent: DisruptionsGridComponent;
	isTemplates: boolean;
	exportClicked = false;
	exportAll = false;
	public pageTitle: string;

	private previewSubscription: Subscription;

	constructor(
		private disruptionsService: DisruptionsListService,
		private disruptionsGridService: DisruptionsGridService,
		private auditHistoryService: AuditHistoryService,
		private jsonMapper: GeojsonMapper,
		private activatedRoute: ActivatedRoute,
		public exportService: ExportService,
		public exportAllFieldsService: ExportAllFieldsService
	) {}

	private showDisruption(encodedId: string) {
		this.disruptionsService.setPreviewDisruption(encodedId);
		this.auditHistoryService.setAuditHistoryForDisruption(encodedId);
	}

	ngOnInit(): void {
		const defaultFilter = new DisruptionsFilter();

		this.activatedRoute.url.subscribe(s => {
			this.isTemplates = s.findIndex(f => f.path === 'templates') > 0;
			defaultFilter.isTemplate = this.isTemplates;
			this.loadData(defaultFilter);
		});
	}

	ngAfterViewInit() {
		if (!this.previewSubscription) {
			this.previewSubscription = this.disruptionsService.previewDisruption$.subscribe(currentDisruption => {
				if (currentDisruption === null && this.tableComponent) {
					const gridApi = this.tableComponent.gridApi;
					if (gridApi) {
						gridApi.deselectAll();
					}
				}
			});
		}
	}

	ngOnDestroy(): void {
		if (this.previewSubscription) {
			this.previewSubscription.unsubscribe();
		}
	}

	ngAfterContentChecked() {
		this.setTitle();
	}

	loadData(filters: DisruptionsFilter): void {
		const filter = new DisruptionsFilterParameters(filters);
		this.mapData$ = this.disruptionsService
			.listDisruptionsforMap(filter)
			.pipe(map(response => response && this.jsonMapper.getDisruptionGeoJson(response)));
		this.tableDataSource = new DisruptionsGridDataSource(
			this.disruptionsGridService,
			filters,
			environment.production ? 100 : 20
		);
		this.exportService.listDisruptions(filter);
		this.exportAllFieldsService.listAllDisruptionFields(filter);
	}

	onMapClick(e: EventData): void {
		this.showDisruption(e.features[0].properties.encodedId);
	}

	onFilterChanged(event: DisruptionsFilter) {
		this.loadData(event);
	}

	private setTitle() {
		this.pageTitle = this.isTemplates ? 'Templates' : 'Disruptions';
	}

	get title(): string {
		return this.pageTitle;
	}
}
