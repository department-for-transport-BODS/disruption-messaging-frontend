import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { RouterTestingModule } from '@angular/router/testing';
import { IAllUsersGQL } from '../../../../generated/graphql';
import { UserMapper } from '../user.mapper';
import { UserListComponent } from '../user-list/user-list.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';

describe('UsersComponent', () => {
	let component: UsersComponent;
	let fixture: ComponentFixture<UsersComponent>;
	let modalService: NgxSmartModalService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UsersComponent, UserListComponent, UserEditComponent, UserDeleteComponent],
			imports: [
				CommonModule,
				SharedModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				NgSelectModule,
				ReactiveFormsModule
			],
			providers: [IAllUsersGQL, UserMapper, NgxSmartModalService]
		}).compileComponents();
		modalService = TestBed.get(NgxSmartModalService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
