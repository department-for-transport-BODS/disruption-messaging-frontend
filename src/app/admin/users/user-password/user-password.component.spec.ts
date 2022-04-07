import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordComponent } from './user-password.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';

describe('UserPasswordComponent', () => {
	let component: UserPasswordComponent;
	let fixture: ComponentFixture<UserPasswordComponent>;
	let service: UsersService;
	let saveSpy;
	let modalService: NgxSmartModalService;

	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
	const mockRouter = {
		navigate: jasmine.createSpy('navigate')
	};
	const mockActivatedRoute = {
		snapshot: { queryParamMap: { get: jasmine.createSpy() } }
	};
	mockActivatedRoute.snapshot.queryParamMap.get.and.returnValue('/disruptions');

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UserPasswordComponent],
			imports: [
				SharedModule,
				RouterTestingModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				ReactiveFormsModule
			],
			providers: [
				NgxSmartModalService,
				{ provide: Router, useValue: mockRouter },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute }
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserPasswordComponent);
		component = fixture.componentInstance;
		service = fixture.debugElement.injector.get(UsersService);
		saveSpy = spyOn(service, 'signUp').and.returnValue(null);
		modalService = TestBed.get(NgxSmartModalService);
		fixture.detectChanges();
	});

	it('should redirect to calling url on close', () => {
		component.ngOnInit();
		fixture.detectChanges();

		spyOn(modalService, 'getModal').and.returnValue(mockModal);

		component.onClose();

		expect(modalService.getModal).toHaveBeenCalledWith('passwordModal');
		expect(mockModal.close).toHaveBeenCalled();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/disruptions']);
	});

	it('should not change password when passwords dont match', () => {
		component.passwordForm.controls.currentPassword.setValue('correctPassword');
		component.passwordForm.controls.password.setValue('foo');
		component.passwordForm.controls.confirmPassword.setValue('bar');
		fixture.detectChanges();
		expect(component.passwordForm.errors.confirmPasswordMisMatch).toBeTruthy('Password mismatch error not raised');
		component.onSubmit();
		expect(saveSpy).toHaveBeenCalledTimes(0);
		component.ngOnDestroy();
	});
});
