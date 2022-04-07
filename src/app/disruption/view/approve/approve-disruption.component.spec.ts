import { ApproveDisruptionComponent } from './approve-disruption.component';
import { ComponentFixture, async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { NgxSmartModalService, NgxSmartModalModule } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormsModule } from '@angular/forms';
import { ReviewDisruptionService } from './review-disruption.service';
import { MockModalService, MockModalComponent } from 'src/app/shared/services/mock-modal.service';
import { Router } from '@angular/router';

describe('ApproveDisruptionComponent', () => {
	let component: ApproveDisruptionComponent;
	let fixture: ComponentFixture<ApproveDisruptionComponent>;
	let service: ReviewDisruptionService;
	let modalService: MockModalService;

	const mockRouter = jasmine.createSpyObj('router', ['navigateByUrl']);
	(mockRouter.navigateByUrl as jasmine.Spy).and.returnValue(Promise.resolve());

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ApproveDisruptionComponent],
			imports: [
				FormsModule,
				SharedModule,
				ApolloTestingModule,
				RouterTestingModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [
				ReviewDisruptionService,
				{ provide: NgxSmartModalService, useClass: MockModalService },
				{ provide: Router, useValue: mockRouter }
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		modalService = TestBed.get(NgxSmartModalService);
		service = TestBed.get(ReviewDisruptionService);
		fixture = TestBed.createComponent(ApproveDisruptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		(mockRouter.navigateByUrl as jasmine.Spy).calls.reset();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should reset', () => {
		spyOn(service, 'reset');
		component.comments = 'this is a temp comment';

		component.resetState();
		expect(service.reset).toHaveBeenCalled();
		expect(component.comments).toBe('');
	});

	it('should set status onApproveButton disruption', () => {
		spyOn(service, 'setStatus');

		component.onApproveButton();

		expect(service.setStatus).toHaveBeenCalledWith('approve');
	});

	it('should set status onApproveButton disruption', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'get').and.returnValue(modal);
		spyOn(modal, 'open');

		component.onApproveButton();

		expect(modalService.get).toHaveBeenCalledWith('approve-modal');
		expect(modal.open).toHaveBeenCalled();
	});

	it('should set status onRejectButton disruption', () => {
		spyOn(service, 'setStatus');

		component.onRejectButton();

		expect(service.setStatus).toHaveBeenCalledWith('reject');
	});

	it('should set status onRejectButton disruption', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'get').and.returnValue(modal);
		spyOn(modal, 'open');

		component.onRejectButton();

		expect(modalService.get).toHaveBeenCalledWith('approve-modal');
		expect(modal.open).toHaveBeenCalled();
	});

	it('should close on cancel', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'get').and.returnValue(modal);
		spyOn(modal, 'close');

		component.onCancel();

		expect(modalService.get).toHaveBeenCalledWith('approve-modal');
		expect(modal.close).toHaveBeenCalled();
	});

	it('should call approve on service', () => {
		spyOn(service, 'approve');

		component.id = 123;
		component.onApprove();

		expect(service.approve).toHaveBeenCalledWith(component.id);
	});

	it('should call reject on service', () => {
		spyOn(service, 'reject');

		component.id = 123;
		component.comments = 'comment comment';
		component.onReject();

		expect(service.reject).toHaveBeenCalledWith(component.id, component.comments);
	});

	it('should close on onComplete', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'get').and.returnValue(modal);
		spyOn(modal, 'close');

		component.onComplete();

		expect(modalService.get).toHaveBeenCalledWith('approve-modal');
		expect(modal.close).toHaveBeenCalled();
	});

	it('should navigate back to reviews', fakeAsync(() => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'get').and.returnValue(modal);
		spyOn(modal, 'close');

		component.onComplete();
		flush();

		expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(2);
		expect(mockRouter.navigateByUrl.calls.allArgs()).toEqual([['/', { skipLocationChange: true }], ['/reviews']]);
	}));
});
