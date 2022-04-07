import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { AgGridModule } from 'ag-grid-angular';
import { TableButtonsParentComponent } from './table-buttons.parent.component';
import Timeout = NodeJS.Timeout;
import { SimpleChanges } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { cloneDeep } from 'lodash';
import Spy = jasmine.Spy;
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TableComponent', () => {
	let component: TableComponent;
	let fixture: ComponentFixture<TableComponent>;
	let intervalId: Timeout;
	let sizeColumnsToFitSpy: Spy<any>;
	let autoSizeAllColumnsSpy: Spy<any>;
	let gridReadySpy: Spy<any>;

	const columnDefs = [{
			headerName: 'Column-1',
			field: 'field-1'
		}, {
			headerName: 'Column-2',
			field: 'field-2'
		}];
	const changes: SimpleChanges = {
		columnDefs: {
			currentValue: columnDefs,
			previousValue: null,
			firstChange: true,
			isFirstChange: () => true
		}
	};
	const rowData = [
		{'field-1': 'foo-1', 'field-2': 'bar-1'},
		{'field-1': 'foo-2', 'field-2': 'bar-2'}
	];
	const getChanges = () => {
		return cloneDeep(changes);
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AgGridModule.withComponents([TableButtonsParentComponent]),
				SharedModule,
				HttpClientTestingModule
			],
			declarations: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableComponent);
		component = fixture.componentInstance;
		component.rowData = rowData;
		gridReadySpy = spyOn(component, 'onGridReady').and.callThrough();
		fixture.detectChanges();
	});

	beforeEach(async (done) => {
		intervalId = setInterval(() => {
				if (component.gridApi) {
					sizeColumnsToFitSpy = spyOn(component.gridApi, 'sizeColumnsToFit').and.callThrough();
					autoSizeAllColumnsSpy = spyOn(component.columnApi, 'autoSizeAllColumns').and.callThrough();
					done();
				}
			}, 500);
	});

	afterEach(() => clearInterval(intervalId));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call onGridReady', () => {
		expect(component.gridApi).toBeTruthy();
		expect(component.columnApi).toBeTruthy();
	});

	it('should display cell entries', () => {
		component.ngOnChanges(getChanges());
		fixture.detectChanges();
		const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
		expect(cellElements.length).toEqual(6); // account for the action cells
		expect(cellElements[0].textContent).toBe('foo-1');
		expect(cellElements[1].textContent).toBe('bar-1');
		expect(cellElements[3].textContent).toBe('foo-2');
		expect(cellElements[4].textContent).toBe('bar-2');
	});

	it('should size columns to fit on load', () => {
		expect(gridReadySpy).toHaveBeenCalled();
	});

	it('should resize columns when grid size changes', () => {
		component.onGridSizeChanged();
		expect(sizeColumnsToFitSpy).toHaveBeenCalled();
		expect(autoSizeAllColumnsSpy).toHaveBeenCalled();
	});

	it('should set autoHeight of all column defs to true', () => {
		component.ngOnChanges(getChanges());
		expect(component.processedColumnDefs[0].autoHeight).toBeTruthy();
		expect(component.processedColumnDefs[1].autoHeight).toBeTruthy();
	});

	it('should set an extra column for actions', () => {
		component.ngOnChanges(getChanges());
		expect(component.processedColumnDefs.length).toEqual(3);
	});

	it('should add actions column', () => {
		component.ngOnChanges(getChanges());
		expect(component.processedColumnDefs[2].cellRendererFramework).toBeTruthy();
	});

	it('should add actions column with empty header', () => {
		component.ngOnChanges(getChanges());
		expect(component.processedColumnDefs[2].headerName).toEqual('');
	});

	it('should set value formatter for null values', () => {
		component.ngOnChanges(getChanges());
		expect(component.processedColumnDefs[0].valueFormatter).toBeTruthy();
		expect(component.processedColumnDefs[0].valueFormatter).toBeTruthy();
	});

	it('should set cell class to auto wrap', () => {
		component.ngOnChanges(getChanges());
		component.processedColumnDefs.forEach((def => def.headerName && expect(def.cellClass).toBe('cell-wrap-text')));
	});

	it('should show the action column on click', () => {
		component.ngOnChanges(getChanges());
		fixture.detectChanges();
		component.onRowClicked({rowIndex: 0});
		component.gridApi.refreshCells({force: true});
		expect(component.selectedIndex).toEqual(0);
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.icon-button');
		expect(buttons.length).toBe(2);
	});

	it('clicking edit button emits edit event', () => {
		component.ngOnChanges(getChanges());
		fixture.detectChanges();
		component.onRowClicked({rowIndex: 0});
		component.gridApi.refreshCells({force: true});
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.icon-button');
		const spy = spyOn(component.edit, 'emit').and.stub();
		buttons[0].click();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('clicking delete button emits delete event', () => {
		component.ngOnChanges(getChanges());
		fixture.detectChanges();
		component.onRowClicked({rowIndex: 0});
		component.gridApi.refreshCells({force: true});
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.icon-button');
		const spy = spyOn(component.delete, 'emit').and.stub();
		buttons[1].click();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('clicking only show delete button when showEdit is false', () => {
		component.showEditButton = false;
		component.ngOnChanges(getChanges());
		fixture.detectChanges();
		component.onRowClicked({rowIndex: 0});
		component.gridApi.refreshCells({force: true});
		fixture.detectChanges();
		const buttons = fixture.nativeElement.querySelectorAll('.icon-button');
		expect(buttons.length).toBe(1);
	});
});
