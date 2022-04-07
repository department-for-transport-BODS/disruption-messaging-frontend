import { IDatasource, IGetRowsParams } from 'ag-grid-community';
import { DisruptionsFilter } from '../filter/disruptions-filter.class';
import { DisruptionsFilterParameters } from '../filter/disruptions-filter-parameters.class';
import { DisruptionsGridModel } from './disruptions-grid.model';
import { DisruptionsGridService } from './disruptions-grid.service';
import { Observable, Subscription } from 'rxjs';
import { IDisruptionSortableFields } from '../../../generated/graphql';

export class DisruptionsGridDataSource implements IDatasource {
	subscriptions: Map<string, Subscription> = new Map();

	constructor(
		private disruptionsService: DisruptionsGridService,
		private filter: DisruptionsFilter,
		private pageSize: number
	) {}

	destroy(): void {
		this.subscriptions.forEach(subs => subs.unsubscribe());
	}

	getQuery(params: IGetRowsParams, sortModel?: IDisruptionSortableFields[]): Observable<DisruptionsGridModel> {
		return this.disruptionsService
			.listDisruptions(
				new DisruptionsFilterParameters(this.filter),
				this.pageSize,
				params.context.graphQLCursor,
				sortModel
			);
	}

	getRows(params: IGetRowsParams): void {
		// tell parent we're coming ..!
		params.context.gridParent.isLoading = true;

		// convert the datatable's sort commands into graphQL world
		let sortModel = DisruptionsGridModel.getDefaultSortField();
		if (params.sortModel.length > 0) {
			sortModel = DisruptionsGridModel.lookupSortableField(params.sortModel[0].colId, params.sortModel[0].sort);
		}

		// check the datatable is requesting the same rowindex that we have a cursor for,
		// if it's different - due to sorting or filtering action - start over.

		if (params.context.datatableLastRequestedRow !== params.startRow) {
			params.context.graphQLCursor = '';
		}

		if  (this.subscriptions.has(params.context.graphqlCursor)) {
			// Already subscribed, nothing to do.
			return;
		}

		const subscription = this.getQuery(params, sortModel).subscribe({
			next: (disruptions: DisruptionsGridModel) => {
				if (!disruptions) { return; }
				// Use the parent reference to communicate back to containing component
				params.context.gridParent.totalCount = disruptions.totalCount;

				// keep track of the last result (cursor)
				// careful: this works if maxConcurrentDatasourceRequests="1"
				params.context.graphQLCursor = disruptions.endCursor;
				params.context.datatableLastRequestedRow = params.endRow; // store to ensure cursor is valid

				params.context.gridParent.isLoading = false;
				// this is the function on the data grid, that we call with the new info.
				if (disruptions.hasNextPage) {
					params.successCallback(disruptions.disruptions);
				} else {
					// there is no more data, tell the datatable we have reached the end.
					params.successCallback(disruptions.disruptions, disruptions.totalCount);
				}
			},
			error: error => {
				console.log(error);
				params.context.gridParent.isLoading = false;
			},
			complete: () => {
				params.context.gridParent.isLoading = false;
			}
		});
		this.subscriptions.set(params.context.graphQLCursor, subscription);
	}
}
