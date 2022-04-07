import { map, take, tap, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ITwitterSearchGQL, ITwitterSearchList } from '../../../../src/generated/graphql';
import { Injectable } from '@angular/core';

export interface TwitterViewModel {
	// This class represents a single (readonly) row in the roles list
	id: string;
	name: string;
}

@Injectable({
providedIn: 'root'
})
export class TwitterUserSearchService {
	data: ITwitterSearchList[];

	constructor(
		private twitterUserSearchGQL: ITwitterSearchGQL,

	) {}


	public getTwitterUsers(searchString: string): Observable<ITwitterSearchList[]> {
		return this.twitterUserSearchGQL
			.fetch({ queryString: searchString })
			.pipe(
				map((
					result) => {
					return result.data.twitterSearch as ITwitterSearchList[];
					}
			));
	}
}
