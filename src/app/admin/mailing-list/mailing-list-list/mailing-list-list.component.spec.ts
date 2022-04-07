import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { MailingListListComponent } from './mailing-list-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MailingListComponent } from '../mailing-list/mailing-list.component';
import { MailingListEditComponent } from '../mailing-list-edit/mailing-list-edit.component';
import { MailingListDeleteComponent } from '../mailing-list-delete/mailing-list-delete.component';
import { MailingListService } from '../mailing-list.service';
import { MailingListMapper } from '../mailing-list.mapper';
import { By } from '@angular/platform-browser';
import { TableComponent } from '../../../shared/components/table/table.component';
import Timeout = NodeJS.Timeout;
import { MailingListViewmodel } from '../mailing-list.viewmodel';
import { cold } from 'jasmine-marbles';

describe('MailingListListComponent', () => {
	let component: MailingListListComponent;
	let fixture: ComponentFixture<MailingListListComponent>;
	let gridComponent: TableComponent;
	let intervalId: Timeout;
	let gridReady: boolean;
	let mlService: MailingListService;
	let modalService: NgxSmartModalService;

	const viewModel: MailingListViewmodel = {
		id: '1',
		email: 'ml-entry@foo.com',
		severityList: [{value: 'VerySevere', title: 'Very Severe'}, {value: 'Slight', title: 'Slight'}],
		severityDisplay: 'Very Severe, Slight',
		optedIn: 'No',
		organisation: {id: '1', name: 'test-org', url: '', adminAreasString: '', adminAreas: []}
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
			]
		}).compileComponents();
		mlService = TestBed.get(MailingListService);
		modalService = TestBed.get(NgxSmartModalService);

		const mlList = cold('a|', { a: [viewModel] });
		spyOn(mlService, 'list').and.returnValue(mlList);
		const mlLoading = cold('a|', { a: false });
		spyOnProperty(mlService, 'loading$').and.returnValue(mlLoading);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MailingListListComponent);
		component = fixture.componentInstance;
		gridComponent = fixture.debugElement.query(By.directive(TableComponent)).context;
		fixture.detectChanges();
	});

	beforeEach(async (done) => {
		intervalId = setInterval(() => {
				if (gridComponent.gridApi) {
					gridReady = true;
					done();
				}
			}, 500);
	});

	afterEach(() => { clearInterval(intervalId); gridReady = false; });

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render mailing-list list', fakeAsync(() => {
		component.ngOnInit();
		fixture.detectChanges();
		component.mailingListEntries$.subscribe(() => {
			fixture.detectChanges();
			const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(5);
			expect(cellElements[0].textContent).toBe(viewModel.email);
			expect(cellElements[1].textContent).toBe(viewModel.severityDisplay);
			expect(cellElements[2].textContent).toBe(viewModel.optedIn);
		});
		flush();
	}));

	it('should react to clicking of edit button', fakeAsync(() => {
		const spy = spyOn(mlService, 'editEntry').and.returnValue(null);
		component.ngOnInit();

		component.mailingListEntries$.subscribe(() => {
			fixture.detectChanges();
			let cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(5);
			gridComponent.onRowClicked({rowIndex: 0});
			gridComponent.gridApi.refreshCells({force: true});
			fixture.detectChanges();
			expect(cellElements.length).toEqual(5);
			cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			const editBtn = cellElements[4].querySelectorAll('.icon-button');
			expect(spy).toHaveBeenCalledTimes(0);
			editBtn[0].click();
			expect(spy).toHaveBeenCalledTimes(1);
		});
		flush();
	}));

	it('should react to clicking of delete button', fakeAsync(() => {
		const spy = spyOn(mlService, 'deleteEntry').and.returnValue(null);
		component.mailingListEntries$.subscribe(() => {
			fixture.detectChanges();
			let cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(5);
			gridComponent.onRowClicked({rowIndex: 0});
			gridComponent.gridApi.refreshCells({force: true});
			fixture.detectChanges();
			expect(cellElements.length).toEqual(5);
			cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			const deleteBtn = cellElements[4].querySelectorAll('.icon-button');
			expect(spy).toHaveBeenCalledTimes(0);
			deleteBtn[1].click();
			expect(spy).toHaveBeenCalledTimes(1);
		});
		flush();
	}));

	it('should set mailingListEntries$ observable on init', (() => {
		component.ngOnInit();
		expect(component.mailingListEntries$).toBeTruthy();
	}));

	it('should set mailingListEntries$ observable on init', (() => {
		component.ngOnInit();
		expect(component.mailingListEntries$).toBeTruthy();
	}));
});
