import { DeleteDisruptionComponent } from './delete-disruption.component';
import { ComponentFixture, async, TestBed, flush, fakeAsync } from '@angular/core/testing';
import { DeleteDisruptionService } from './delete-disruption.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { cold } from 'jasmine-marbles';

describe('DeleteDisruptionComponent', () => {
	let component: DeleteDisruptionComponent;
	let fixture: ComponentFixture<DeleteDisruptionComponent>;
	let deleteDisruptionService: DeleteDisruptionService;
	let modalService: NgxSmartModalService;

	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
	const mockRouter = jasmine.createSpyObj('router', ['navigateByUrl']);
	(mockRouter.navigateByUrl as jasmine.Spy).and.returnValue(Promise.resolve());

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteDisruptionComponent],
			imports: [
				AngularSvgIconModule,
				NgxSmartModalModule.forRoot(),
				SharedModule,
				NgSelectModule,
				ApolloTestingModule,
				RouterTestingModule
			],
			providers: [DeleteDisruptionService, NgxSmartModalService, { provide: Router, useValue: mockRouter }]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteDisruptionComponent);
		deleteDisruptionService = TestBed.get(DeleteDisruptionService);
		modalService = TestBed.get(NgxSmartModalService);
		component = fixture.componentInstance;
		fixture.detectChanges();

		(mockRouter.navigateByUrl as jasmine.Spy).calls.reset();
	});

	it('should create component', () => {
		expect(component).toBeTruthy();
	});

	it('should set up subscription for status', fakeAsync(() => {
		const $obs = cold('a', { a: 'status_string' });
		spyOnProperty(deleteDisruptionService, 'status$').and.returnValue($obs);

		component.ngOnInit();
		flush();

		$obs.subscribe(() => {
			expect(component.status).toBe('status_string');
		});
	}));

	it('should set up subscription for errors', fakeAsync(() => {
		const $obs = cold('a', { a: 'ERRORS!!!' });
		spyOnProperty(deleteDisruptionService, 'errors$').and.returnValue($obs);

		component.ngOnInit();
		flush();

		$obs.subscribe(() => {
			expect(component.serverErrors).toBe('ERRORS!!!');
		});
	}));

	it('should open modal', () => {
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.onDeleteButton();

		expect(modalService.get).toHaveBeenCalledWith('delete-modal');
		expect(mockModal.open).toHaveBeenCalled();
	});

	it('should close modal', () => {
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.onCancel();

		expect(modalService.get).toHaveBeenCalledWith('delete-modal');
		expect(mockModal.close).toHaveBeenCalled();
	});

	it('should call delete service to reset', () => {
		spyOn(deleteDisruptionService, 'reset');
		component.resetState();
		expect(deleteDisruptionService.reset).toHaveBeenCalled();
	});

	it('should call delete', () => {
		spyOn(deleteDisruptionService, 'delete');

		const id = 445;
		component.id = id;

		component.onOK();
		expect(deleteDisruptionService.delete).toHaveBeenCalledWith(id);
	});

	it('should close modal on complete', () => {
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.onComplete();

		expect(modalService.get).toHaveBeenCalledWith('delete-modal');
		expect(mockModal.close).toHaveBeenCalled();
	});

	it('should emit completion event', () => {
		spyOn(component.onCompletion, 'emit');
		spyOn(modalService, 'get').and.returnValue(mockModal);
		component.onComplete();

		expect(component.onCompletion.emit).toHaveBeenCalled();
	});

	it('should reload disruptions list', fakeAsync(() => {
		spyOn(modalService, 'get').and.returnValue(mockModal);

		component.redirectUrl = 'templates';
		component.onComplete();
		flush();

		expect(mockRouter.navigateByUrl).toHaveBeenCalledTimes(2);
		expect(mockRouter.navigateByUrl.calls.allArgs()).toEqual([['/', { skipLocationChange: true }], ['/templates']]);
	}));
});
