import { async, ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { OrgListComponent } from './org-list.component';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { OrganisationViewModel } from '../organisation.viewmodel';
import { OrganisationMapper } from '../organisation.mapper';
import { OrganisationService } from '../organisation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { TableButtonsParentComponent } from '../../../shared/components/table/table-buttons.parent.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TableComponent } from '../../../shared/components/table/table.component';
import { By } from '@angular/platform-browser';
import Timeout = NodeJS.Timeout;

describe('OrgListComponent', () => {
	let component: OrgListComponent;
	let gridComponent: TableComponent;
	let fixture: ComponentFixture<OrgListComponent>;
	let controller: ApolloTestingController;
	let mapper: OrganisationMapper;
	let orgService: OrganisationService;
	let modalService: NgxSmartModalService;
	let intervalId: Timeout;
	let gridReady: boolean;

	const viewModel: OrganisationViewModel = {
		id: '1',
		name: 'organisation-1',
		url: 'http://foo.com',
		adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222, organisations: null }],
		adminAreasString: 'An area'
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ApolloTestingModule,
				HttpClientTestingModule,
				NgxSmartModalModule.forRoot(),
				SharedModule,
				RouterTestingModule,
				AgGridModule.withComponents([TableButtonsParentComponent])],
			declarations: [OrgListComponent],
			providers: [NgxSmartModalService]
		}).compileComponents();
		controller = TestBed.get(ApolloTestingController);
		orgService = TestBed.get(OrganisationService);
		mapper = TestBed.get(OrganisationMapper);
		modalService = TestBed.get(NgxSmartModalService);

		const orgList = cold('a|', { a: [viewModel] });
		spyOn(orgService, 'list').and.returnValue(orgList);

		const loading = cold('a|', { a: false });
		spyOnProperty(orgService, 'loading$').and.returnValue(loading);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrgListComponent);
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

	it('should render organisation list', fakeAsync(() => {
		component.ngOnInit();
		component.organisations$.subscribe(() => {
			fixture.detectChanges();
			const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(4);
			expect(cellElements[0].textContent).toBe(viewModel.name);
			expect(cellElements[1].textContent).toBe(viewModel.url);
			expect(cellElements[2].textContent).toBe(viewModel.adminAreasString);
		});
		flush();
	}));

	it('should react to clicking of edit button', fakeAsync(() => {
		const spy = spyOn(orgService, 'editOrganisation').and.returnValue(null);
		component.ngOnInit();

		component.organisations$.subscribe(() => {
			fixture.detectChanges();
			let cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(4);
			gridComponent.onRowClicked({rowIndex: 0});
			gridComponent.gridApi.refreshCells({force: true});
			fixture.detectChanges();
			expect(cellElements.length).toEqual(4);
			cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			const editBtn = cellElements[3].querySelectorAll('.icon-button');
			expect(spy).toHaveBeenCalledTimes(0);
			editBtn[0].click();
			expect(spy).toHaveBeenCalledTimes(1);
		});
		flush();
	}));

	it('should react to clicking of delete button', fakeAsync(() => {
		const spy = spyOn(orgService, 'deleteOrganisation').and.returnValue(null);
		component.organisations$.subscribe(() => {
			fixture.detectChanges();
			let cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(4);
			gridComponent.onRowClicked({rowIndex: 0});
			gridComponent.gridApi.refreshCells({force: true});
			fixture.detectChanges();
			expect(cellElements.length).toEqual(4);
			cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			const editBtn = cellElements[3].querySelectorAll('.icon-button');
			expect(spy).toHaveBeenCalledTimes(0);
			editBtn[1].click();
			expect(spy).toHaveBeenCalledTimes(1);
		});
		flush();
	}));
});
