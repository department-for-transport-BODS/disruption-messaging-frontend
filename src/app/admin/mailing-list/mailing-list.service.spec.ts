import { async, TestBed } from '@angular/core/testing';

import { MailingListService } from './mailing-list.service';
import { SharedModule } from '../../shared/shared.module';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MailingListComponent } from './mailing-list/mailing-list.component';
import { MailingListListComponent } from './mailing-list-list/mailing-list-list.component';
import { MailingListEditComponent } from './mailing-list-edit/mailing-list-edit.component';
import { MailingListDeleteComponent } from './mailing-list-delete/mailing-list-delete.component';
import { MailingListMapper } from './mailing-list.mapper';
import Spy = jasmine.Spy;
import { IMailingListType, IOrganisationType } from '../../../generated/graphql';
import { MailingListViewmodel } from './mailing-list.viewmodel';
import { getTestScheduler } from 'jasmine-marbles';
import { MockModalService, MockModalComponent } from 'src/app/shared/services/mock-modal.service';


describe('MailingListService', () => {
	let mlService: MailingListService;
	let resetSubjectsSpy: Spy<any>;

	const mlEntry: IMailingListType = {
		id: '1',
		email: 'ml-entry@foo.com',
		severity: ['Very Severe', 'Slight'],
		optedIn: false,
		organisation: {id: '1', name: 'test-org', url: '', adminAreas: []} as IOrganisationType
	} as IMailingListType;

	let viewModel: MailingListViewmodel;
	let mapper: MailingListMapper;
	let modalService: MockModalService;


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
				{ provide: NgxSmartModalService, useClass: MockModalService },
			]
		}).compileComponents();
		mlService = TestBed.get(MailingListService);
		mapper = TestBed.get(MailingListMapper);
		viewModel = mapper.getModel(mlEntry);
		resetSubjectsSpy = spyOn(mlService, 'resetSubjects').and.callThrough();
		modalService = TestBed.get(NgxSmartModalService);
	}));

	it('should be created', () => {
		const service: MailingListService = TestBed.get(MailingListService);
		expect(service).toBeTruthy();
	});

	it('should select items for updating.',  async (done) => {
		mlService.selectForEdit$().subscribe(entry => {
			expect(entry).toEqual(viewModel);
			done();
		});
		mlService.editEntry(viewModel);
		getTestScheduler().flush();
	});

	it('should open edit modal.', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'getModal').and.returnValue(modal);
		spyOn(modal, 'open');

		mlService.editEntry(viewModel);

		expect(modalService.getModal).toHaveBeenCalledWith('mlModal');
		expect(modal.open).toHaveBeenCalled();
	});

	it('should open add modal.', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'getModal').and.returnValue(modal);
		spyOn(modal, 'open');

		mlService.addEntry();
		expect(resetSubjectsSpy).toHaveBeenCalled();
		expect(modalService.getModal).toHaveBeenCalledWith('mlModal');
		expect(modal.open).toHaveBeenCalled();
	});

	it('modalClose() closes modal.', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'getModal').and.returnValue(modal);
		spyOn(modal, 'close');

		mlService.modalClose();
		expect(resetSubjectsSpy).toHaveBeenCalled();
		expect(modalService.getModal).toHaveBeenCalledWith('mlModal');
		expect(modal.close).toHaveBeenCalled();
	});
	it('deleteModalClose() closes modal.', () => {
		const modal = new MockModalComponent();
		spyOn(modalService, 'getModal').and.returnValue(modal);
		spyOn(modal, 'close');

		mlService.deleteModalClose();
		expect(resetSubjectsSpy).toHaveBeenCalled();
		expect(modalService.getModal).toHaveBeenCalledWith('mlDeleteModal');
		expect(modal.close).toHaveBeenCalled();
	});
});
