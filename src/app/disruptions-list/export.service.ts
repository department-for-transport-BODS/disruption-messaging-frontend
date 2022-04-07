import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDisruptionNodeConnection, IExportDisruptionsListGQL } from 'src/generated/graphql';
import { DisruptionsFilterParameters } from './filter/disruptions-filter-parameters.class';
import { Injectable } from '@angular/core';
import { DisruptionsGridMapper } from './grid/disruptions-grid.mapper';
import { DisruptionsGridModel } from './grid/disruptions-grid.model';
import { DisruptionsGridRowViewModel } from './grid/disruptions-gridrow.viewmodel';

@Injectable({
	providedIn: 'root'
})
export class ExportService {
	loading = true;
	data: DisruptionsGridRowViewModel[];
	constructor(
		private disruptionListGQL: IExportDisruptionsListGQL,
		private disruptionsMapper: DisruptionsGridMapper

	) {}


	getDisruptions(filters?: DisruptionsFilterParameters): Observable<DisruptionsGridModel> {
		return this.disruptionListGQL
			.fetch({
				status: filters.status,
				severity: filters.severity,
				mode: filters.mode,
				operators: filters.operators,
				lines: filters.lines,
				startDate: filters.startDate,
				endDate: filters.endDate,
				titleFilter: filters.searchText,
				isTemplate: filters.isTemplate,
			})
			.pipe(
				map(result => {
					return this.disruptionsMapper.getExportModel(
						result.data.allDisruptions as IDisruptionNodeConnection);
					}
				)
			);
	}

	listDisruptions(filters?: DisruptionsFilterParameters): void {
		this.data = [];
		this.getDisruptions(filters).pipe(take(1)).subscribe(disgrid => { this.data = disgrid.disruptions; });
	}
}
