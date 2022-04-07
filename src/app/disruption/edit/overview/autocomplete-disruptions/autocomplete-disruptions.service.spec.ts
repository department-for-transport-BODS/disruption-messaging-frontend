import { TestBed } from '@angular/core/testing';
import { IAutcompleteDisruptionsListGQL, IDisruptionNodeConnection } from 'src/generated/graphql';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IAutoCompleteDisruptionsMapper } from './autocomplete-disruptions.mapper';
import { AutocompleteDisruptionsService } from './autocomplete-disruptions.service';

describe('AutocompleteDisruptionService', () => {
	let service: AutocompleteDisruptionsService;
	let controller: ApolloTestingController;
	let mapper: IAutoCompleteDisruptionsMapper;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, RouterTestingModule],
			providers: [IAutcompleteDisruptionsListGQL, IAutoCompleteDisruptionsMapper]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(AutocompleteDisruptionsService);
		mapper = TestBed.get(IAutoCompleteDisruptionsMapper);
	});

	it('should get list of disruptions', done => {
		const term = 'closed';
		const allDisruptions: IDisruptionNodeConnection = {
			pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: '' },
			edges: [],
			totalCount: 0
		};
		const result = { data: { allDisruptions } };

		service.autocomplete(term).subscribe(s => {
			done();
		});

		const query = controller.expectOne('autcompleteDisruptionsList');
		query.flush(result);
		expect(query.operation.variables.titleFilter).toBe(term);
	});

	it('should get list of disruptions without search term', done => {
		const allDisruptions: IDisruptionNodeConnection = {
			pageInfo: { hasNextPage: false, hasPreviousPage: false, startCursor: '', endCursor: '' },
			edges: [],
			totalCount: 0
		};
		const result = { data: { allDisruptions } };

		service.autocomplete().subscribe(s => {
			done();
		});

		const query = controller.expectOne('autcompleteDisruptionsList');
		query.flush(result);
		expect(query.operation.variables.titleFilter).toBe(null);
	});
});
