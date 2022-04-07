import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { UsersService } from '../users.service';
import { UserListComponent } from './user-list.component';
import { IOrganisationType, IRoleType, IUserType } from '../../../../generated/graphql';
import { IRoleScope } from '../../../../generated/enum-overrides';
import { UserMapper } from '../user.mapper';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserViewModel } from '../user.viewmodel';
import { AgGridModule } from 'ag-grid-angular';
import { TableButtonsParentComponent } from '../../../shared/components/table/table-buttons.parent.component';

describe('UserListComponent', () => {
	let component: UserListComponent;
	let fixture: ComponentFixture<UserListComponent>;
	let controller: ApolloTestingController;
	let service: UsersService;
	let mapper: UserMapper;
	let modalService: NgxSmartModalService;

	const userModel: IUserType = {
		id: '1',
		username: 'user-1',
		email: 'user@foo.com',
		organisation: { name: 'organisation-1', id: '1', created: '', modified: '' } as IOrganisationType,
		roles: [{ id: '1', name: 'Administrator', scope: IRoleScope.SYS, created: '', modified: '' } as IRoleType]
	};
	let viewModel: UserViewModel;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				SharedModule,
				AgGridModule.withComponents([TableButtonsParentComponent])],
			declarations: [UserListComponent],
			providers: [NgxSmartModalService, UsersService]
		}).compileComponents();
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(UsersService);
		mapper = TestBed.get(UserMapper);
		modalService = TestBed.get(NgxSmartModalService);
		viewModel = mapper.getModel(userModel);
		const userList = cold('a|', { a: [viewModel] });
		spyOn(service, 'list').and.returnValue(userList);
		const loading = cold('a|', { a: false });
		spyOnProperty(service, 'loading$').and.returnValue(loading);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render user list', fakeAsync(() => {
		component.ngOnInit();
		fixture.detectChanges();
		component.users$.subscribe(() => {
			fixture.detectChanges();
			const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
			expect(cellElements.length).toEqual(5);
			expect(cellElements[0].textContent).toBe(viewModel.username);
			expect(cellElements[1].textContent).toBe(viewModel.email);
			expect(cellElements[2].textContent).toBe(viewModel.organisation.name);
			expect(cellElements[3].textContent).toBe(viewModel.roleDisplay);
		});
		flush();
	}));
});
