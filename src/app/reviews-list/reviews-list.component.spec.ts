import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewsListComponent } from './reviews-list.component';
import { SharedModule } from '../shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('ReviewsListComponent', () => {
	let component: ReviewsListComponent;
	let fixture: ComponentFixture<ReviewsListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ReviewsListComponent],
			imports: [
				SharedModule,
				RouterTestingModule,
				ApolloTestingModule
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReviewsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
