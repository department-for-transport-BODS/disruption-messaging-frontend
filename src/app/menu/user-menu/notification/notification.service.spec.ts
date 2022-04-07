import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationService', () => {
	let service: NotificationService;
	let controller: ApolloTestingController;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, HttpClientTestingModule],
			providers: [NotificationService]
		})
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(NotificationService);
	});

	it('should call readNotification mutation', fakeAsync(() => {
		service.markAsRead('fakeId');

		const op = controller.expectOne('readNotification');
		expect(op.operation.variables.id).toEqual('fakeId');
		op.flush({
			data: {
				readNotification: {
					data: {
						id: 'fakeId'
					},
					success: true,
					errors: null
				}
			}
		});
		flush();

		service.notificationRead$.subscribe(s => {
			expect(s).toBe('fakeId');
		});

		controller.verify();
	}));
});
