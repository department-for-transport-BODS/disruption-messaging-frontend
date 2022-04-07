import { DisruptionsGridDataSource } from './disruptions-grid.datasource';
import { DisruptionsFilter } from '../filter/disruptions-filter.class';
import { IGetRowsParams } from 'ag-grid-community';
import { cold } from 'jasmine-marbles';
import { IDisruptionSortableFields } from 'src/generated/graphql';

describe('DisruptionsGridDataSource', () => {
	let mockService;
	const mockFilter = new DisruptionsFilter();

	beforeEach(() => {
		mockService = jasmine.createSpyObj('service', ['listDisruptions']);
	});

	it('should create', () => {
		const ds = new DisruptionsGridDataSource(mockService, mockFilter, 1);

		expect(ds).toBeTruthy();
	});

	it('should call service', () => {
		const obs$ = cold('a|', { a: {} });
		(mockService.listDisruptions as jasmine.Spy).and.returnValue(obs$);

		const ds = new DisruptionsGridDataSource(mockService, mockFilter, 1);

		const params: IGetRowsParams = {
			startRow: 0,
			endRow: 100,
			sortModel: null,
			filterModel: null,
			context: { graphQLCursor: null },
			successCallback: () => {},
			failCallback: () => {}
		};
		ds.getQuery(params, null);

		expect(mockService.listDisruptions).toHaveBeenCalled();
	});

	it('should tell the parent we are coming', () => {
		const obs$ = cold('a|', { a: {} });
		(mockService.listDisruptions as jasmine.Spy).and.returnValue(obs$);

		const mockContext = {
			gridParent: { isLoading: false }
		};

		const sortModel: IDisruptionSortableFields[] = [IDisruptionSortableFields.Status];

		const params: IGetRowsParams = {
			startRow: 0,
			endRow: 100,
			sortModel,
			filterModel: null,
			context: mockContext,
			successCallback: () => {},
			failCallback: () => {}
		};

		const ds = new DisruptionsGridDataSource(mockService, mockFilter, 1);

		ds.getRows(params);
		expect(mockContext.gridParent.isLoading).toBeTruthy();
	});
});
