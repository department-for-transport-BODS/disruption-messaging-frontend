import { TestBed} from '@angular/core/testing';
import { DisruptionsGridService } from './disruptions-grid.service';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { IDisruptionsListGQL } from 'src/generated/graphql';
import { DisruptionsGridMapper } from './disruptions-grid.mapper';
import { DisruptionViewModelsTestBuilder } from '../../shared/disruption-mapper/disruption-viewmodels.test-builder';
import * as disruptionTestdata from '../../shared/disruption-mapper/disruption-testdata';
import { DisruptionsGridModel } from './disruptions-grid.model';
import { DisruptionsFilterParameters } from '../filter/disruptions-filter-parameters.class';
import { DisruptionsFilter } from '../filter/disruptions-filter.class';
import { getTestScheduler } from 'jasmine-marbles';

const mockMapper = {
	getGridModel: jasmine.createSpy('getGridModel')
};

describe('DisruptionsGridService', () => {
	let controller: ApolloTestingController;
	let service: DisruptionsGridService;
	let gridViewModel: DisruptionsGridModel = null;
	const builder = new DisruptionViewModelsTestBuilder();
	const allDisruptions = disruptionTestdata.allDisruptions;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [
				{ provide: DisruptionsGridMapper, useValue: mockMapper },
				IDisruptionsListGQL,
				DisruptionsGridService
			]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(DisruptionsGridService);
		gridViewModel = builder.createGridModel();
	});

	afterEach(() => {
		controller.verify();
	});

	it('should load disruption list', async (done) => {
		const filterParams = new DisruptionsFilterParameters(new DisruptionsFilter());
		const list = service.listDisruptions(filterParams, null, null, null);

		mockMapper.getGridModel.and.returnValue(gridViewModel);

		list.subscribe(data => {
			expect(data).toBe(gridViewModel);
			done();
		});

		controller.expectOne('disruptionsList').flush({
			data: {
				allDisruptions
			}
		});
		getTestScheduler().flush();
	});
});
