import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { ReviewsDashboardComponent } from './reviews-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReviewsDashboardListMapper } from './reviews-dashboard.list.mapper';
import { ReviewsDashboardListService } from './reviews-dashboard.list.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { cold } from 'jasmine-marbles';
import { ReviewsDashboardListViewModel } from './reviews-dashboard.list.viewmodel';


describe('ReviewsDashboardComponent', () => {
	let component: ReviewsDashboardComponent;
	let service: ReviewsDashboardListService;
	let fixture: ComponentFixture<ReviewsDashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule, CommonModule, NgSelectModule, RouterTestingModule, ApolloTestingModule],
			declarations: [ReviewsDashboardComponent],
			providers: [ReviewsDashboardListMapper, ReviewsDashboardListService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReviewsDashboardComponent);
		component = fixture.componentInstance;
		service = TestBed.get(ReviewsDashboardListService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get reviews', fakeAsync(() => {
		const a: ReviewsDashboardListViewModel[] = [{ title: 'title', id: '123' }];
		const obs$ = cold('a', { a });
		spyOn(service, 'listReviews').and.returnValue(obs$);

		component.ngOnInit();

		expect(component.reviews$).toBe(obs$);
	}));

	it('should get reviews total count ', fakeAsync(() => {
		const a: ReviewsDashboardListViewModel[] = [{ title: 'title', id: '123' }];
		const obs$ = cold('a', { a });
		spyOn(service, 'listReviews').and.returnValue(obs$);
		const countObs$ = cold('a', { a: 1 });
		spyOnProperty(service, 'reviewsCount$').and.returnValue(countObs$);

		component.ngOnInit();
		flush();

		service.reviewsCount$.subscribe(s => {
			expect(component.reviewsCount).toBe(s);
		});
	}));

	it('should get recently closed', fakeAsync(() => {
		const a: ReviewsDashboardListViewModel[] = [{ title: 'title', id: '123' }];
		const obs$ = cold('a', { a });
		spyOn(service, 'recentlyClosed').and.returnValue(obs$);

		component.ngOnInit();

		expect(component.recentlyClosed$).toBe(obs$);
	}));

	it('should get recently closed total count ', fakeAsync(() => {
		const a: ReviewsDashboardListViewModel[] = [{ title: 'title', id: '123' }];
		const obs$ = cold('a', { a });
		spyOn(service, 'recentlyClosed').and.returnValue(obs$);
		const countObs$ = cold('a', { a: 1 });
		spyOnProperty(service, 'recentlyClosedCount$').and.returnValue(countObs$);

		component.ngOnInit();
		flush();

		service.recentlyClosedCount$.subscribe(s => {
			expect(component.recentlyClosedCount).toBe(s);
		});
	}));
});
