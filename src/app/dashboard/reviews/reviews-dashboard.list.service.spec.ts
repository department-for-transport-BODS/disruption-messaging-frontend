import { ReviewsDashboardListService } from './reviews-dashboard.list.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { ReviewsDashboardListMapper } from './reviews-dashboard.list.mapper';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { IReviewsDashboardListGQL, IDisruptionNode } from 'src/generated/graphql';
import { DisruptionViewModelsTestBuilder } from 'src/app/shared/disruption-mapper/disruption-viewmodels.test-builder';
import { ReviewsDashboardListViewModel } from './reviews-dashboard.list.viewmodel';
import { getTestScheduler } from 'jasmine-marbles';

describe('ReviewsDashboardListService', () => {
	let service: ReviewsDashboardListService;
	let controller: ApolloTestingController;
	let mapper: ReviewsDashboardListMapper;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IReviewsDashboardListGQL]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(ReviewsDashboardListService);
		mapper = TestBed.get(ReviewsDashboardListMapper);
	});

	it('should load reviews for dashboard', () => {
		const testbuilder = new DisruptionViewModelsTestBuilder();
		const disruptions: IDisruptionNode[] = [
			testbuilder.createIDisruptionNode(),
			testbuilder.createIDisruptionNode()
		];
		const viewModel: ReviewsDashboardListViewModel = { id: '22', title: 'titles titles titles' };
		spyOn(mapper, 'getReviewDasboardModel').and.returnValue(viewModel);

		service.listReviews().subscribe(s => {
			expect(s.length).toBe(disruptions.length);
		});
		getTestScheduler().flush();
		controller.expectOne('reviewsDashboardList').flush({
			data: {
				allDisruptions: {
					totalCount: 2,
					edges: [{
						node: disruptions[0]
					}, {
						node: disruptions[1]
					}]
				}
			}
		});
		getTestScheduler().flush();
		service.reviewsCount$.subscribe(s => {
			expect(s).toBe(2);
		});
	});

	it('should load recently closed for dashboard', () => {
		const testbuilder = new DisruptionViewModelsTestBuilder();
		const disruptions: IDisruptionNode[] = [
			testbuilder.createIDisruptionNode(),
			testbuilder.createIDisruptionNode()
		];
		const viewModel: ReviewsDashboardListViewModel = { id: '22', title: 'titles titles titles' };
		spyOn(mapper, 'getReviewDasboardModel').and.returnValue(viewModel);

		service.recentlyClosed().subscribe(s => {
			expect(s.length).toBe(disruptions.length);
		});
		controller.expectOne('recentlyClosed').flush({
			data: {
				recentlyClosed: {
					totalCount: 2,
					edges: [{
						node: disruptions[0]
					}, {
						node: disruptions[1]
					}]
				}
			}
		});
		getTestScheduler().flush();
		service.recentlyClosedCount$.subscribe(s => {
			expect(s).toBe(2);
		});
	});
});
