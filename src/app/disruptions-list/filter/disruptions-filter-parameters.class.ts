import * as moment from 'moment';
import { IDisruptionStatusInput, ISeverityInput, IModeInput } from 'src/generated/graphql';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { DisruptionsFilter } from './disruptions-filter.class';

export class DisruptionsFilterParameters {
	status: IDisruptionStatusInput;
	severity: ISeverityInput;
	mode: IModeInput;
	operators: string[];
	lines: string[];
	searchText: string;
	startDate: string;
	endDate: string;
	isTemplate: boolean;

	// extracts fields in types suitable for GraphQL query, turning all blanks into nulls
	constructor( filter: DisruptionsFilter ) {
		if (filter === null) {
			// create blank parameters if a null filter passed in.  Can happen due to async observables.
			filter = new DisruptionsFilter();
		}
		return {
			status: (filter.status !== '' ? filter.status : null) as IDisruptionStatusInput,
			severity: (filter.severity !== '' ? filter.severity : null) as ISeverityInput,
			mode: (filter.mode !== '' ? filter.mode : null) as IModeInput,
			operators: filter.operators ? filter.operators : null,
			lines: filter.lines ? filter.lines : null,
			searchText: filter.searchText,
			startDate:
				filter.dateRange && filter.dateRange.startDate
					? moment(filter.dateRange.startDate).format(DateFormatter.ISODateFormat)
					: null,
			endDate:
				filter.dateRange && filter.dateRange.endDate
					? moment(filter.dateRange.endDate).format(DateFormatter.ISODateFormat)
					: null,
			isTemplate: filter.isTemplate
		} as DisruptionsFilterParameters;
	}
}
