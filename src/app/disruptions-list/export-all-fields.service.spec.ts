import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ExportAllFieldsService } from './export-all-fields.service';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { IExportDisruptionsListGQL } from 'src/generated/graphql';
import * as disruptionTestdata from '../shared/disruption-mapper/disruption-testdata';
import {DisruptionsGridMapper} from './grid/disruptions-grid.mapper';
import {DisruptionsFilterParameters} from './filter/disruptions-filter-parameters.class';
import {DisruptionsFilter} from './filter/disruptions-filter.class';

describe('ExportAllFieldsService', () => {
	let apolloController: ApolloTestingController;
	let exportService: ExportAllFieldsService;

	const disruptions = disruptionTestdata.allDisruptionFields;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IExportDisruptionsListGQL, DisruptionsGridMapper]
		})
	);

	beforeEach(() => {
		apolloController = TestBed.get(ApolloTestingController);
		exportService = TestBed.get(ExportAllFieldsService);
	});

	it('should fetch and map the results to view model', fakeAsync(() => {
		const decodedId = '63';
		const defaultFilter = new DisruptionsFilter();
		exportService.listAllDisruptionFields(new DisruptionsFilterParameters(defaultFilter));
		apolloController.expectOne('exportDisruptionsList').flush({data: {allDisruptions: disruptions}});
		flush();
		expect(exportService.data[0].id).toEqual(decodedId);
		apolloController.verify();
		})
	);
});
