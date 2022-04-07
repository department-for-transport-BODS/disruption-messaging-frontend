import { QueryService } from '../shared/services/query.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnumValuesGQL, ISetEnumsGQL, IEnumOverridesObject, IUserUsageInformationGQL, IUserType } from 'src/generated/graphql';
import { filter, map } from 'rxjs/operators';
import { EnumValueViewModel, UserUsageInformationViewModel } from './settings.viewmodel';
import { UserViewModel } from '../admin/users/user.viewmodel';
import { SettingsViewModelMapper } from './settings.viewmodel.mapper';
import { UserMapper } from '../admin/users/user.mapper';

@Injectable({
	providedIn: 'root'
})
export class SettingsService extends QueryService {
	constructor(
		private enumListGQL: IEnumValuesGQL,
		private setEnums: ISetEnumsGQL,
		private userUsageInformationGQL: IUserUsageInformationGQL,
		private mapper: SettingsViewModelMapper
	) {
		super();
	}

	clearResponse() {
		this.resetSubjects();
	}

	enumValueViewModelList(): Observable<EnumValueViewModel[]> {
		return this.enumListGQL
			.watch()
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(map(res =>
				this.mapper.toViewModel(res.data.enumValues)));
	}

	userUsageInformationViewModelList(startDate: string, endDate: string): Observable<UserUsageInformationViewModel[]> {
		return this.userUsageInformationGQL
			.watch({
				fromDate: startDate,
				toDate: endDate
			})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(
					res =>
						this.mapper.toUserUsageViewModel(res.data.allUsers)));
	}

	enumList$(): Observable<IEnumOverridesObject[]> {
		return this.enumListGQL
			.watch()
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(res => res.data.enumValues));
	}

	setEnumValues(viewmodels: EnumValueViewModel[]) {
		const params = this.mapper.toGraphQLInput(viewmodels);
		this.setEnums
			.mutate({ params })
			.subscribe(
				res => this.responseHandler(res.data.setEnumOverrides),
				({ networkError }) => this.errorHandler(networkError)
			);
	}
}
