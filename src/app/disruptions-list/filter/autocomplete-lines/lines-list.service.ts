import { Observable } from 'rxjs';
import { filter, map, debounceTime } from 'rxjs/operators';
import { ILinesListGQL, ITransModelLineType } from 'src/generated/graphql';
import { Injectable } from '@angular/core';
import { sortBy } from 'lodash';


@Injectable({
	providedIn: 'root'
})
export class LinesListService {
	constructor(private linesListGQL: ILinesListGQL) {}

	listLines(): Observable<ITransModelLineType[]> {
		return this.linesListGQL
			.fetch()
			.pipe(debounceTime(1000))
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(map(result => sortBy(result.data.allLines, [(o) => parseInt(o.name, 10)])));
	}
}
