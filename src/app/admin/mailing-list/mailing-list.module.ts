import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailingListListComponent } from './mailing-list-list/mailing-list-list.component';
import { MailingListEditComponent } from './mailing-list-edit/mailing-list-edit.component';
import { MailingListDeleteComponent } from './mailing-list-delete/mailing-list-delete.component';
import { MailingListComponent } from './mailing-list/mailing-list.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SettingsModule } from '../../settings/settings.module';


@NgModule({
	declarations: [MailingListListComponent, MailingListEditComponent, MailingListDeleteComponent, MailingListComponent],
	exports: [
		MailingListComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		NgxSmartModalModule.forRoot(),
		SettingsModule
	]
})
export class MailingListModule {
}
