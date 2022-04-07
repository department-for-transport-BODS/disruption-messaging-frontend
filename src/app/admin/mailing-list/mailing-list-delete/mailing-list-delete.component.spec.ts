import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingListDeleteComponent } from './mailing-list-delete.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MailingListComponent } from '../mailing-list/mailing-list.component';
import { MailingListListComponent } from '../mailing-list-list/mailing-list-list.component';
import { MailingListEditComponent } from '../mailing-list-edit/mailing-list-edit.component';
import { MailingListService } from '../mailing-list.service';
import { MailingListMapper } from '../mailing-list.mapper';
import { IMailingListType, IOrganisationType } from '../../../../generated/graphql';
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { MockModalComponent, MockModalService } from '../../../shared/services/mock-modal.service';

describe('MailingListDeleteComponent', () => {
	let component: MailingListDeleteComponent;
	let fixture: ComponentFixture<MailingListDeleteComponent>;
	let mapper: MailingListMapper;
	let mlService: MailingListService;
	let modalService: MockModalService;
	const mlEntry: IMailingListType = {
		id: '1',
		email: 'ml-entry@foo.com',
		severity: ['Very Severe', 'Slight'],
		optedIn: false,
		organisation: {id: '1', name: 'test-org', url: '', adminAreas: []} as IOrganisationType
	} as IMailingListType;

	let viewModel: MailingListViewmodel;

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
				{provide: NgxSmartModalService, useClass: MockModalService}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MailingListDeleteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		mapper = TestBed.get(MailingListMapper);
		viewModel = mapper.getModel(mlEntry);
		fixture.detectChanges();
		mlService = TestBed.get(MailingListService);
		modalService = TestBed.get(NgxSmartModalService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should open delete confirmation modal',  () => {
		const getModalSpy = spyOn(modalService, 'getModal').and.returnValue(new MockModalComponent());
		const modal = modalService.getModal('mlDeleteModal');
		const openModalSpy = spyOn(modal, 'open').and.callThrough();
		component.ngOnInit();
		fixture.detectChanges();
		mlService.selectForDelete = viewModel;
		expect(getModalSpy).toHaveBeenCalledWith('mlDeleteModal');
		expect(openModalSpy).toHaveBeenCalled();
	});

	it('should unsubscribe on destroy', () => {
		component.ngOnDestroy();
		expect(component.subscription.closed).toBeTruthy();
	});
});
