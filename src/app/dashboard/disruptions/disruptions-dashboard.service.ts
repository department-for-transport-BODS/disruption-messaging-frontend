import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
	IDisruptionStatsGQL,
	IDisruptionStatsType, ISeverityInput
} from 'src/generated/graphql';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class DisruptionsDashboardService {
	constructor(
		private disruptionStatsGQL: IDisruptionStatsGQL
	) {}

	disruptionStats(first: number, after?: string, severity?: ISeverityInput): Observable<IDisruptionStatsType> {
		return this.disruptionStatsGQL
			.watch({ first, after, severity }, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(result => {
					return result.data.disruptionStats as IDisruptionStatsType;
				})
		);
	}
}
