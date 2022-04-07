import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableButtonsParentComponent } from './table-buttons.parent.component';
import { ColumnApi, DetailGridInfo, GridApi, GridOptions, GridParams } from 'ag-grid-community';
import { cloneDeep } from 'lodash';

interface ColumnDef {
	headerName: string;
	field: string;
	width?: number;
	minWidth?: number;
	valueFormatter?: string;
	autoHeight?: boolean;
	cellClass?: string;
	hide?: boolean;
	cellRendererFramework?: any;
	editable?: boolean;
	suppressSizeToFit?: boolean;
	cellStyle?: any;
}

@Component({
	selector: 'dm-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

	@Input() rowData: any;

	@Input() columnDefs: ColumnDef[];

	@Input() resource: string;

	@Input() showEditButton = true;

	@Input() showDeleteButton = true;

	@Input() loading = false;

	@Output() edit: EventEmitter<any> = new EventEmitter<any>();

	@Output() delete: EventEmitter<any> = new EventEmitter<any>();

	processedColumnDefs: ColumnDef[] = [];
	public gridOptions: GridOptions;
	public gridApi: GridApi = null;
	public columnApi: ColumnApi = null;
	public defaultColumnDef = {
		resizable: true,
		width: 120,
		minWidth: 120,
		//cellStyle: {'margin-left': '0.5rem'}
	};
	public selectedIndex: number;

	constructor() {}

	ngOnInit() {
		this.gridOptions = {
			context: {
				gridParent: this
			},
			overlayNoRowsTemplate: `<div>No ${this.resource}s found.</div>`,
			overlayLoadingTemplate: `<div> Loading ${this.resource}s...`,
		};
	}

	onGridReady(params: DetailGridInfo) {
		this.gridApi = params.api;
		this.columnApi = params.columnApi;
		this.gridApi.sizeColumnsToFit();
	}

	onGridSizeChanged() {
		this.columnApi.autoSizeAllColumns();
		this.gridApi.sizeColumnsToFit();
	}

	ngOnChanges(changes: SimpleChanges): void {
		const columnDefs = changes.columnDefs;
		if (columnDefs && columnDefs.currentValue) {
			this.processedColumnDefs = columnDefs.currentValue;
			this.processedColumnDefs.map(column => {
				column.valueFormatter = 'value || "-"';
				column.autoHeight = true;
				column.cellClass = 'cell-wrap-text';
			});
			const width = this.showEditButton ? 110 : 80;
			this.processedColumnDefs.push({
				headerName: '',
				field: '',
				minWidth: width,
				hide: false,
				editable: false,
				suppressSizeToFit: true,
				cellRendererFramework: TableButtonsParentComponent
			});
		}
	}

	onColumnResized() {
		this.gridApi.resetRowHeights();
	}

	onRowClicked(event) {
		this.selectedIndex = this.selectedIndex === event.rowIndex ? null : event.rowIndex;
	}

	resetSelectedIndex() {
		this.selectedIndex = null;
	}
}
