import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { IDisruptionNodeConnection, IDisruptionStatsGQL, IDisruptionStatsType } from '../../../generated/graphql';
import { fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared/shared.module';
import { DisruptionsDashboardService } from './disruptions-dashboard.service';
import { DisruptionsDashboardMapper } from './disruptions-dashboard.mapper';
import { DisruptionsDashboardViewModel } from './disruptions-dashboard.viewmodel';
import * as moment from 'moment';
import { disruptionStatsRes } from './disruption-dashboard.testdata';
import { getTestScheduler } from 'jasmine-marbles';

describe('DisruptionsDashboard', () => {
	let service: DisruptionsDashboardService;
	let controller: ApolloTestingController;
	let mapper: DisruptionsDashboardMapper;
	let mapperSpy;
	const viewModel: DisruptionsDashboardViewModel = {
		id: '1',
		encodedId: '1',
		title: 'A disruption',
		operatorCount: 2,
		operatorWide: false,
		networkWide: false,
		startDate: moment.now().toString(),
		endDate: moment.now().toString(),
		servicesAffectedCount: 2,
		severity: null,
		stopsAffectedCount: 43
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [SharedModule, ApolloTestingModule],
			providers: [IDisruptionStatsGQL]
		});
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(DisruptionsDashboardService);
		mapper = TestBed.get(DisruptionsDashboardMapper);
		mapperSpy = spyOn(mapper, 'getDisruptionsForDashboard').and.returnValue(viewModel);
	});

	it('fetches disruption stats', async (done) => {
		service.disruptionStats(50).subscribe(s => {
			expect(s).toEqual(disruptionStatsRes);
			done();
		});
		controller.expectOne('disruptionStats').flush({
			data: {
				disruptionStats: disruptionStatsRes
			}
		});
		getTestScheduler().flush();
		controller.verify();
	});
});
