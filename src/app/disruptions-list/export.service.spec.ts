import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExportService } from './export.service';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { IExportDisruptionsListGQL } from 'src/generated/graphql';
import * as disruptionTestdata from '../shared/disruption-mapper/disruption-testdata';
import {DisruptionsGridMapper} from './grid/disruptions-grid.mapper';
import {DisruptionsFilterParameters} from './filter/disruptions-filter-parameters.class';
import {DisruptionsFilter} from './filter/disruptions-filter.class';

describe('ExportService', () => {
	let apolloController: ApolloTestingController;
	let exportService: ExportService;

	const disruptions = disruptionTestdata.allDisruptions;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IExportDisruptionsListGQL, DisruptionsGridMapper]
		})
	);

	beforeEach(() => {
		apolloController = TestBed.get(ApolloTestingController);
		exportService = TestBed.get(ExportService);
	});

	it('should fetch and map the results to view model', fakeAsync(() => {
		const decodedId = '63';
		const defaultFilter = new DisruptionsFilter();
		exportService.listDisruptions(new DisruptionsFilterParameters(defaultFilter));
		apolloController.expectOne('exportDisruptionsList').flush({data: {allDisruptions: disruptions}});
		tick(1000);
		expect(exportService.data[0].id).toEqual(decodedId);
		apolloController.verify();
		})
	);
});
