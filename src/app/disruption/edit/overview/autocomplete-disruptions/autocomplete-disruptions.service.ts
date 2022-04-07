import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDisruptionNodeConnection, IAutcompleteDisruptionsListGQL } from 'src/generated/graphql';
import { IAutoCompleteDisruptionsMapper } from './autocomplete-disruptions.mapper';
import { DisruptionAutocompleteModel } from './disruption-autocomplete.model';

@Injectable({
	providedIn: 'root'
})
export class AutocompleteDisruptionsService {
	constructor(
		private distruptionsAutocomplete: IAutcompleteDisruptionsListGQL,
		private mapper: IAutoCompleteDisruptionsMapper
	) {}

	public autocomplete(searchTerm: string = null): Observable<DisruptionAutocompleteModel[]> {
		return this.distruptionsAutocomplete.fetch({ titleFilter: searchTerm }).pipe(
			map(result => {
				return this.mapper.getAutocompleteModels(result.data.allDisruptions as IDisruptionNodeConnection);
			})
		);
	}
}
