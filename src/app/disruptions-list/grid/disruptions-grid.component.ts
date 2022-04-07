import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DisruptionsGridDataSource } from './disruptions-grid.datasource';
import { GridOptions } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { LiveIndicatorParentComponent } from './live-indicator.parent.component';

@Component({
	selector: 'dm-disruptions-grid',
	templateUrl: './disruptions-grid.component.html',
	styleUrls: ['./disruptions-grid.component.scss']
})
export class DisruptionsGridComponent implements OnChanges, OnDestroy {
	public totalCount: number;
	public isLoading: false;

	public gridOptions: GridOptions;
	public gridApi;

	public columnDefs = [
		{
			headerName: 'Id',
			field: 'id',
			sortable: false,
			width: 100,
			suppressSizeToFit: true},
		{
			headerName: 'Summary',
			field: 'title',
			sortable: false,
			autoHeight: true,
			width: 180,
			minWidth: 150,
		},
		{
			headerName: 'Mode',
			field: 'serviceModes',
			sortable: false,
			width: 80,
			minWidth: 60,
		},
		{
			headerName: 'Services',
			field: 'data',
			sortable: false,
			width: 60,
			minWidth: 60,
			cellRenderer(params) {
				if (params.data) {
					if (params.data.networkWide) {
						return 'Network';
					}
					if (params.data.operatorWide) {
						return 'Operator';
					}
					return params.data.servicesAffectedCount;
				}
				return 0;
			}
		},
		{
			headerName: 'Stops',
			field: 'data',
			sortable: false,
			width: 60,
			minWidth: 60,
			cellRenderer(params) {
				if (params.data) {
					if (params.data.networkWide) {
						return 'Network';
					}
					if (params.data.operatorWide) {
						return 'Operator';
					}
					return params.data.stopsAffectedCount;
				}
				return 0;
			}
		},
		{
			headerName: 'Starts', field: 'startDate', sortable: true, width: 120, minWidth: 110
		},
		{
			headerName: 'Ends', field: 'endDate', sortable: true, width: 120, minWidth: 110
		},
		{
			headerName: 'Severity',
			field: 'severity',
			cellRenderer(params) {
				if (!params.data) {
					return '';
				}
				return params.data.severity;
			},
			sortable: true,
			width: 120,
			minWidth: 100,
		},
		{
			headerName: 'Status',
			field: 'status',
			sortable: true,
			cellRendererFramework: LiveIndicatorParentComponent,
			width: 100,
			minWidth: 80,
		},
		{
			headerName: '',  // This column is so that the last column remains resizable.
		}
	];

	public defaultColDef = {
		resizable: true,
		width: 90,
		minWidth: 60
	};

	@Input()
	dataSource: DisruptionsGridDataSource;
	@Output()
	rowSelected = new EventEmitter<string>();

	constructor() {
		this.gridOptions = {
			context: {
				gridParent: this, // Provides a reference for the DataSource to talk back to this component
				datatableLastRequestedRow: 0, // track datatable's current index, in case it gets reset by sorting / filtering
				graphQLCursor: '' // cursor of last request
			},
			rowModelType: 'infinite',
			cacheBlockSize: environment.production ? 100 : 20,
			maxConcurrentDatasourceRequests: 1,
			rowSelection: 'single',
			blockLoadDebounceMillis: 200,
			suppressHorizontalScroll: false,
		} as GridOptions;
	}

	ngOnDestroy(): void {
		if (this.dataSource) {
			this.dataSource.destroy();
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.gridApi) {
			this.gridApi.setDatasource(this.dataSource);
		}
	}

	onGridReady(params) {
		this.gridApi = params.api;

		const defaultSortModel = [{colId: 'startDate', sort: 'asc'}];
		this.gridApi.setSortModel(defaultSortModel);

		this.gridApi.setDatasource(this.dataSource);
		this.gridApi.sizeColumnsToFit();
	}

	onGridSizeChanged() {
		this.gridApi.sizeColumnsToFit();
	}

	onRowSelected(selected) {
		if (selected.node.selected) {
			this.rowSelected.emit(selected.node.data.encodedId);
		}
	}

	suppressKeyboardEvent(params) {
		const KEY_LEFT = 37;
		const KEY_UP = 38;
		const KEY_RIGHT = 39;
		const KEY_DOWN = 40;
		const key = params.event.which;

		const selectedRows = params.api.getSelectedNodes();
		const selectedRowIndex = selectedRows.length === 1 ? selectedRows[0].rowIndex : 0;

		switch (key) {
			case KEY_DOWN:
				if (!params.event.ctrlKey && !params.event.metaKey) {
					// set selected cell on current cell + 1
					params.api.forEachNode(node => {
						if (selectedRowIndex + 1 === node.rowIndex) {
							node.setSelected(true);
						}
					});
					return false;
				}
				break;
			case KEY_UP:
				if (!params.event.ctrlKey && !params.event.metaKey) {
					// set selected cell on current cell + 1
					params.api.forEachNode(node => {
						if (selectedRowIndex - 1 === node.rowIndex) {
							node.setSelected(true);
						}
					});
					return false;
				}
				break;

			case KEY_LEFT:
				return false;
			case KEY_RIGHT:
				return false;
		}
		return true;
	}
}
