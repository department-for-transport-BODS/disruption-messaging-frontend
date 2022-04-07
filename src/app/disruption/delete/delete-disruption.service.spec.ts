import { DeleteDisruptionService } from './delete-disruption.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { IDeleteDisruptionGQL } from 'src/generated/graphql';

describe('DeleteDisruptionService', () => {
	let service: DeleteDisruptionService;
	let controller: ApolloTestingController;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IDeleteDisruptionGQL]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(DeleteDisruptionService);
	});

	it('should call delete disruption with id', fakeAsync(() => {
		const id = 134;
		const encodedId = 'RGlzcnVwdGlvbk5vZGU6MTM0';

		service.delete(id);
		const mutation = controller.expectOne('deleteDisruption');
		mutation.flush({
			data: {
				deleteDisruption: {
					success: true,
					errors: null
				}
			}
		});
		flush();

		expect(mutation.operation.variables.id).toBe(encodedId);
	}));

	it('should set success', fakeAsync(() => {
		service.delete(134);
		const mutation = controller.expectOne('deleteDisruption');
		mutation.flush({
			data: {
				deleteDisruption: {
					success: true,
					errors: null
				}
			}
		});
		flush();

		service.status$.subscribe(s => {
			expect(s).toBe('success');
		});
	}));

	it('should set status to errror', fakeAsync(() => {
		service.delete(134);
		const mutation = controller.expectOne('deleteDisruption');
		mutation.flush({
			data: {
				deleteDisruption: {
					success: false,
					errors: null
				}
			}
		});
		flush();

		service.status$.subscribe(s => {
			expect(s).toBe('error');
		});
	}));

	it('should set status errors from server', fakeAsync(() => {
		service.delete(134);
		const mutation = controller.expectOne('deleteDisruption');
		const errorObj = { some: 'error' };
		mutation.flush({
			data: {
				deleteDisruption: {
					success: false,
					errors: errorObj
				}
			}
		});
		flush();

		service.errors$.subscribe(s => {
			expect(s).toEqual(errorObj);
		});
	}));

	it('should reset values', () => {
		service.reset();

		service.errors$.subscribe(s => {
			expect(s).toEqual(null);
		});

		service.status$.subscribe(s => {
			expect(s).toEqual('confirm');
		});
	});
});
