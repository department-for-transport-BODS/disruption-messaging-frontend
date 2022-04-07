import { Observable } from 'rxjs';
import {map, filter, debounceTime} from 'rxjs/operators';
import { IOperatorsListGQL, ITransModelOperatorType } from 'src/generated/graphql';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class OperatorsListService {
	constructor(private operatorsListGQL: IOperatorsListGQL) {}

	listOperators(): Observable<ITransModelOperatorType[]> {
		return this.operatorsListGQL
			.fetch()
			.pipe(debounceTime(1000))
			.pipe(filter(result => Boolean(result.data)))
			.pipe(map(result => result.data.allOperators));
	}
}
