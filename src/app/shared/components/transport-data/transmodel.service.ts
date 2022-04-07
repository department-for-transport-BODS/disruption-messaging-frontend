import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import {
	IOperatorByModeGQL,
	ILineGQL,
	ITransModelOperatorType,
	IModeTypeEnum,
	ISearchStopsGQL,
	IAllLinesGQL,
	ISearchAreaLinesGQL,
	ISearchAreaStopsGQL,
	IStopGeoJsonGQL, IOsGridCoordinate, ITransModelAdminAreaListType, IAdminAreasGQL, IStopsGeoJsonGQL
} from 'src/generated/graphql';
import { Injectable } from '@angular/core';
import { TransModelLineViewMapper, TransModelStopViewMapper } from './transmodel.view.mapper';
import { TransModelLineViewModel, TransModelStopsViewModel } from './transmodel.view.model';
import { sortBy } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class TransModelService {
	modes: IModeTypeEnum[] = [];
	constructor(
		private operatorsListGQL: IOperatorByModeGQL,
		private allLinesGQL: IAllLinesGQL,
		private lineGQL: ILineGQL,
		private searchStopsGQL: ISearchStopsGQL,
		private searchAreaLinesGQL: ISearchAreaLinesGQL,
		private searchAreaStopsGQL: ISearchAreaStopsGQL,
		private stopGeoJson: IStopGeoJsonGQL,
		private stopsGeoJson: IStopsGeoJsonGQL,
		private adminAreasGQL: IAdminAreasGQL
	) {}

	listOperators(): Observable<ITransModelOperatorType[]> {
		return this.operatorsListGQL
			.watch({ modes: this.modes })
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => sortBy(result.data.allOperators, 'featureName'))
			);
	}

	allLines(operators?: string[]): Observable<TransModelLineViewModel[]> {
		return this.allLinesGQL
			.watch({ operators, modes: this.modes })
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					return sortBy(result.data.allLines.map(
							line => TransModelLineViewMapper.toTransModelLineViewModel(line)),
						[(o) => parseInt(o.name, 10)]);
				})
			);
	}

	line(entityId: string): Observable<TransModelLineViewModel> {
		return this.lineGQL
			.fetch({ entityId })
			.pipe(map(result => result.data && TransModelLineViewMapper.toTransModelLineViewModel(result.data.line)));
	}

	searchStops(term: string): Observable<TransModelStopsViewModel[]> {
		return this.searchStopsGQL
			.fetch({ term, modes: this.modes })
			.pipe(
				map(result => {
					if (result.data.searchStops) {
						return sortBy(result.data.searchStops.map(stop =>
							TransModelStopViewMapper.toTransModelStopViewModel(stop)
						), 'featureName');
					}
					return [];
				})
		);
	}

	searchAreaLines(polygon: IOsGridCoordinate[]): Observable<TransModelLineViewModel[]> {
		return this.searchAreaLinesGQL
			.fetch({ polygon })
			.pipe(
				map(result => {
					if (result.data.searchAreaLines) {
						return result.data.searchAreaLines.map(line =>
							TransModelLineViewMapper.toTransModelLineViewModel(line)
						);
					}
					console.warn(result.errors);
					return [];
				})
		);
	}

	searchAreaStops(polygon: IOsGridCoordinate[]): Observable<TransModelStopsViewModel[]> {
		return this.searchAreaStopsGQL.fetch({ polygon, modes: this.modes }).pipe(
			map(result => {
				if (result.data.searchAreaStops) {
					return sortBy(result.data.searchAreaStops.map(stop =>
						TransModelStopViewMapper.toTransModelStopViewModel(stop)
					), 'featureName');
				}
				console.warn(result.errors);
				return [];
			})
		);
	}

	stop$(entityId: string): Observable<TransModelStopsViewModel> {
		return this.stopGeoJson
			.fetch({ entityId })
			.pipe(map(result => TransModelStopViewMapper.toTransModelStopViewModel(result.data.stop)));
	}

	stops$(entityIds: string[]): Observable<TransModelStopsViewModel[]> {
		return this.stopsGeoJson
			.fetch({ entityIds })
			.pipe(
				map(result =>
					result.data.stops.map(
						stop => TransModelStopViewMapper.toTransModelStopViewModel(stop))));
	}

	setModes(modes: IModeTypeEnum[]) {
		this.modes = modes;
	}

	adminAreas$(): Observable<ITransModelAdminAreaListType[]> {
		return this.adminAreasGQL
			.watch()
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(map(
				result => result.data.adminAreas));
	}
}
