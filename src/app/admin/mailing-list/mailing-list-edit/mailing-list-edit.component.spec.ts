import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingListEditComponent } from './mailing-list-edit.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MailingListComponent } from '../mailing-list/mailing-list.component';
import { MailingListListComponent } from '../mailing-list-list/mailing-list-list.component';
import { MailingListDeleteComponent } from '../mailing-list-delete/mailing-list-delete.component';
import { MailingListService } from '../mailing-list.service';
import { MailingListMapper } from '../mailing-list.mapper';
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { IMailingListType, IOrganisationType } from '../../../../generated/graphql';
import { cold } from 'jasmine-marbles';
import { UserStoreService } from '../../../user/user.store.service';
import { UserViewModel } from '../../users/user.viewmodel';

describe('MailingListEditComponent', () => {
	let component: MailingListEditComponent;
	let fixture: ComponentFixture<MailingListEditComponent>;
	let mlService: MailingListService;
	let mapper: MailingListMapper;
	const mlEntry: IMailingListType = {
		id: '1',
		email: 'ml-entry@foo.com',
		severity: ['Very Severe', 'Slight'],
		optedIn: false,
		organisation: {id: '1', name: 'test-org', url: '', adminAreas: []} as IOrganisationType
	} as IMailingListType;

	const userModel: UserViewModel = {
		username: 'user-1',
		organisation: {name: 'org-1', id: '1'} as IOrganisationType,
	} as UserViewModel;

	let viewModel: MailingListViewmodel;
	let formModel: any;
	let userService: UserStoreService;

	const getFormModel = (vm: MailingListViewmodel) => {
		return {
			id: vm.id,
			email: vm.email,
			severity: vm.severityList,
			organisation: vm.organisation
		};
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				NgxSmartModalModule.forRoot(),
				CommonModule,
				NgSelectModule,
				FormsModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule
			],
			declarations: [
				MailingListComponent,
				MailingListListComponent,
				MailingListEditComponent,
				MailingListDeleteComponent,
			],
			providers: [
				FormBuilder,
				MailingListService,
				MailingListMapper,
				UserStoreService
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MailingListEditComponent);
		component = fixture.componentInstance;
		mapper = TestBed.get(MailingListMapper);
		viewModel = mapper.getModel(mlEntry);
		formModel = getFormModel(viewModel);
		fixture.detectChanges();
		mlService = TestBed.get(MailingListService);
		userService = TestBed.get(UserStoreService);
		const userObs$ = cold('a|', {a: userModel});
		spyOnProperty(userService, 'user$').and.returnValue(userObs$);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should update form when an entry is selected for edit', () => {
		const formSpy = spyOn(component.mlForm, 'patchValue');
		component.ngOnInit();
		component.service.selectForEdit = viewModel;
		expect(formSpy).toHaveBeenCalledWith(formModel);
	});

	it('should reset form for creating new entry', () => {
		const formSpy = spyOn(component.mlForm, 'reset');
		component.ngOnInit();
		component.service.selectForEdit = null;
		expect(formSpy).toHaveBeenCalled();
	});

	it('should call save on submit', () => {
		const formSpy = spyOn(component.service, 'save');
		component.ngOnInit();
		component.mlForm.patchValue(formModel);
		component.onSubmit();
		expect(formSpy).toHaveBeenCalledWith(component.mlForm);
	});

	it('email has validators attached', () => {
		component.ngOnInit();
		expect(component.email.errors.required).toBeTruthy();
		component.email.setValue('foo-bad-email-not-at');
		expect(component.email.errors.email).toBeTruthy();
		component.email.setValue('foo@bar.com');
		expect(component.email.errors).toBeFalsy();
	});
});
