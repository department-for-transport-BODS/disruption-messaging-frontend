import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { IApproveDisruptionGQL, IRejectDisruptionGQL } from 'src/generated/graphql';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewDisruptionService } from './review-disruption.service';

describe('ReviewDisruptionService', () => {
	let service: ReviewDisruptionService;
	let controller: ApolloTestingController;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, RouterTestingModule],
			providers: [IApproveDisruptionGQL, IRejectDisruptionGQL]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(ReviewDisruptionService);
	});

	it('should approve disruption', fakeAsync(() => {
		const id = 4;
		service.approve(id);

		const approve = controller.expectOne('approveDisruption');
		expect(approve.operation.variables.id).toEqual('RGlzcnVwdGlvbk5vZGU6NA==');
		approve.flush({
			data: { approveDisruption: { success: true, errors: [] } }
		});
		flush();

		service.status$.subscribe(status => {
			expect(status).toBe('success');
		});
	}));

	it('should set errors when fails to approve disruption', fakeAsync(() => {
		const errors = [{ errors: 'any error' }];
		const id = 4;
		service.approve(id);

		const approve = controller.expectOne('approveDisruption');
		expect(approve.operation.variables.id).toEqual('RGlzcnVwdGlvbk5vZGU6NA==');
		approve.flush({
			data: { approveDisruption: { success: false, errors } }
		});
		flush();

		service.status$.subscribe(status => {
			expect(status).toBe('error');
		});

		service.errors$.subscribe(err => {
			expect(err).toBe(errors);
		});
	}));
});
