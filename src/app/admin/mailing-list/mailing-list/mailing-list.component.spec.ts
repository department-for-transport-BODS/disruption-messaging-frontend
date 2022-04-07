import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailingListComponent } from './mailing-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MailingListService } from '../mailing-list.service';
import { MailingListMapper } from '../mailing-list.mapper';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MailingListListComponent } from '../mailing-list-list/mailing-list-list.component';
import { MailingListEditComponent } from '../mailing-list-edit/mailing-list-edit.component';
import { MailingListDeleteComponent } from '../mailing-list-delete/mailing-list-delete.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MailingListComponent', () => {
	let component: MailingListComponent;
	let fixture: ComponentFixture<MailingListComponent>;

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
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MailingListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
