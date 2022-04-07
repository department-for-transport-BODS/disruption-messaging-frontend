import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { EventData } from 'mapbox-gl';
import { map, pluck, filter } from 'rxjs/operators';
import { IDisruptionStatsType, ISeverityInput } from '../../../generated/graphql';

import { FeatureCollection } from '../../shared/components/map/disruptions-map.geojson.classes';
import { GeojsonMapper } from '../../shared/components/map/disruptions-map.geojson.mapper';

import { DisruptionsDashboardViewModel } from './disruptions-dashboard.viewmodel';
import { DisruptionsDashboardMapper } from './disruptions-dashboard.mapper';
import { Router } from '@angular/router';
import { DisruptionsDashboardService } from './disruptions-dashboard.service';
import { EnumFormatter, EnumTuple } from '../../shared/formatters/enum.formatter';

const liveOrUpcoming = {
	live: 'liveDisruptions',
	upcoming: 'upcomingDisruptions'
};

@Component({
	selector: 'dm-disruptions-dashboard',
	providers: [DisruptionsDashboardService],
	templateUrl: './disruptions-dashboard.component.html',
	styleUrls: ['./disruptions-dashboard.component.scss']
})
export class DisruptionsDashboardComponent implements OnInit {
	liveAndUpcomingDisruptions$: Observable<IDisruptionStatsType>;
	mapData$: Observable<FeatureCollection>;
	tableData$: Observable<DisruptionsDashboardViewModel[]>;
	type = 'live';
	severity: ISeverityInput = undefined;
	filterSeverityCodes: EnumTuple[];

	constructor(
		private jsonDataMapper: GeojsonMapper,
		private disruptionsMapper: DisruptionsDashboardMapper,
		private disruptionsService: DisruptionsDashboardService,
		private router: Router,
	) {
		this.filterSeverityCodes = EnumFormatter.toHumanisedDictionary(ISeverityInput);
	}

	ngOnInit(): void {
		this.loadData();
	}

	onIconClick(e: EventData) {
		this.router.navigate(['/disruption/', e.features[0].properties.id]);
	}

	severityChanged() {
		this.loadData();
	}

	loadData(): void {
		const disruptionsCollection = liveOrUpcoming[this.type];

		this.liveAndUpcomingDisruptions$ = this.disruptionsService.disruptionStats(50, undefined, this.severity);

		this.mapData$ = this.liveAndUpcomingDisruptions$
			.pipe(filter(result => result != null))
			.pipe(pluck(disruptionsCollection))
			.pipe(map(disruptions => this.jsonDataMapper.getDisruptionGeoJson(disruptions)));

		this.tableData$ = this.liveAndUpcomingDisruptions$
			.pipe(filter(result => result != null))
			.pipe(pluck(disruptionsCollection, 'edges'))
			.pipe(map(edges => edges.map(edge => this.disruptionsMapper.getDisruptionsForDashboard(edge.node))));
	}
}
