import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IDisruptionsListGQL, IDisruptionNodeConnection, IDisruptionSortableFields } from 'src/generated/graphql';
import { DisruptionsGridMapper } from './disruptions-grid.mapper';
import { DisruptionsGridModel } from './disruptions-grid.model';
import { Injectable } from '@angular/core';
import { DisruptionsFilterParameters } from '../filter/disruptions-filter-parameters.class';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class DisruptionsGridService {
	constructor(private disruptionListGQL: IDisruptionsListGQL, private disruptionsMapper: DisruptionsGridMapper) {}

	listDisruptions(
		filters: DisruptionsFilterParameters,
		first: number,
		after: string,
		sortBy: IDisruptionSortableFields[]
	): Observable<DisruptionsGridModel> {
		return this.disruptionListGQL
			.watch({
				status: filters.status,
				severity: filters.severity,
				mode: filters.mode,
				operators: filters.operators,
				lines: filters.lines,
				startDate: filters.startDate,
				endDate: filters.endDate,
				titleFilter: filters.searchText,
				isTemplate: filters.isTemplate,
				first,
				after,
				sortBy
			}, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					return this.disruptionsMapper.getGridModel(
						result.data.allDisruptions as IDisruptionNodeConnection);
				})
			);
	}
}
