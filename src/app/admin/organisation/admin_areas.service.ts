import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {
	IAdminAreaType,
	IAllAdminAreasGQL,
} from '../../../generated/graphql';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AdminAreasService {
	constructor(
		private listAdminAreasGQL: IAllAdminAreasGQL,
	) {}

	list(): Observable<IAdminAreaType[]> {
		return this.listAdminAreasGQL
			.fetch()
			.pipe(
				map(result => result.data.allAdminAreas as IAdminAreaType[])
			);
	}
}
