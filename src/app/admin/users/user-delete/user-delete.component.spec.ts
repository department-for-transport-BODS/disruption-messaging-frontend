import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { UserDeleteComponent } from './user-delete.component';
import { SharedModule } from '../../../shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { cold } from 'jasmine-marbles';
import { UsersService } from '../users.service';
import { UserViewModel } from '../user.viewmodel';
import { IOrganisationType, IRoleType } from '../../../../generated/graphql';
import { IRoleScope } from '../../../../generated/enum-overrides';
import { FormBuilder } from '@angular/forms';
import { MockModalService } from 'src/app/shared/services/mock-modal.service';

describe('UserDeleteComponent', () => {
	let component: UserDeleteComponent;
	let fixture: ComponentFixture<UserDeleteComponent>;
	let service: UsersService;
	let subscriptionSpy;
	let deleteSpy;
	const viewModel: UserViewModel = {
		id: '1',
		username: 'foo',
		email: 'foo@bar.com',
		organisation: { id: '1' } as IOrganisationType,
		role: { name: 'role', scope: IRoleScope.ORG } as IRoleType,
		roleDisplay: 'role-scopef',
		organisationDisplay: 'org-1',
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserDeleteComponent],
			imports: [SharedModule, ApolloTestingModule, NgxSmartModalModule.forRoot(), RouterTestingModule],
			providers: [FormBuilder, UsersService, { provide: NgxSmartModalService, useClass: MockModalService }]
		}).compileComponents();
		service = TestBed.get(UsersService);
		deleteSpy = spyOn(service, 'delete').and.returnValue(null);
		const obs = cold('a|', { a: viewModel });
		subscriptionSpy = spyOnProperty(service, 'deleteUser$').and.returnValue(obs);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should subscribe for selected user for delete', fakeAsync(() => {
		component.ngOnInit();
		expect(subscriptionSpy).toHaveBeenCalled();
		subscriptionSpy().subscribe(() => expect(component.user).toBeTruthy());
	}));

	it('should delete user on confirm', fakeAsync(() => {
		expect(deleteSpy).toHaveBeenCalledTimes(0);
		component.user = viewModel;
		const confirmDeleteBtn = fixture.nativeElement.querySelectorAll('dm-button');
		const button = confirmDeleteBtn[1].querySelector('button');
		button.click();
		flush();
		fixture.detectChanges();
		expect(deleteSpy).toHaveBeenCalled();
	}));

	it('should not delete user on close', fakeAsync(() => {
		component.user = viewModel;
		const confirmDeleteBtn = fixture.nativeElement.querySelectorAll('dm-button');
		const button = confirmDeleteBtn[0].querySelector('button');
		button.click();
		flush();
		fixture.detectChanges();
		expect(deleteSpy).toHaveBeenCalledTimes(0);
	}));
});
