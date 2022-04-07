import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { UsersModule } from './users/users.module';
import { OrganisationModule } from './organisation/organisation.module';
import { TabsService } from '../shared/components/tabs/tabs.service';
import { SharedModule } from '../shared/shared.module';
import { SocialModule } from '../social/social.module';
import { SocialComponent } from './social/social.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MailingListModule } from './mailing-list/mailing-list.module';
import { HootSuiteCellRenderer } from './social/hootsuite-profile.cell.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
	declarations: [AdminComponent, SocialComponent, HootSuiteCellRenderer],
	imports: [
		CommonModule,
		UsersModule,
		OrganisationModule,
		SocialModule,
		MailingListModule,
		SharedModule,
		AgGridModule.withComponents([HootSuiteCellRenderer]),
		NgxSmartModalModule],
	providers: [TabsService],
	exports: [AdminComponent, HootSuiteCellRenderer]
})
export class AdminModule {}

