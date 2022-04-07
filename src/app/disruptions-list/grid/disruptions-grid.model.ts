import { DisruptionsGridRowViewModel } from './disruptions-gridrow.viewmodel';
import { IDisruptionSortableFields } from 'src/generated/graphql';

// tslint:disable: max-line-length

export class DisruptionsGridModel {

	// This is a container model for the data that populates the Disruptions Grid, it has the Listing view model and also the relay paging data and total row count
	constructor(
		public totalCount: number,
		public hasNextPage: boolean,
		public endCursor: string,
		public disruptions: DisruptionsGridRowViewModel[]
	) { }


	public static lookupSortableField(columnName: string, sortDirection: string): IDisruptionSortableFields[] {

		// This maps sort events from the disruption list table to available sort commands in the gql query.
		// Not all columns are currently sortable.

		const sortOrders = new Array<IDisruptionSortableFields>();

		switch (columnName) {

			case 'serviceModes':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.ModeReversed : IDisruptionSortableFields.Mode);
				break;

			case 'startDate':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.ValidityPeriodStartDateReversed : IDisruptionSortableFields.ValidityPeriodStartDate);
				break;

			case 'endDate':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.ValidityPeriodEndDateReversed : IDisruptionSortableFields.ValidityPeriodEndDate);
				break;

			case 'severity':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.SeverityReversed : IDisruptionSortableFields.Severity);
				break;

			case 'data':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.StatusReversed : IDisruptionSortableFields.Status);
				break;

			case 'status':
				sortOrders.push(sortDirection === 'desc' ? IDisruptionSortableFields.StatusReversed : IDisruptionSortableFields.Status);
				break;

		}

		return sortOrders;

	}

	public static getDefaultSortField() {
		const sortOrders = new Array<IDisruptionSortableFields>();
		sortOrders.push(IDisruptionSortableFields.ValidityPeriodStartDate);
		return sortOrders;
	}
}
