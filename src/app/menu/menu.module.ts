import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OrgMenuComponent } from './org-menu/org-menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NotificationComponent } from './user-menu/notification/notification.component';

import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { NotificationService } from './user-menu/notification/notification.service';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { UsersModule } from '../admin/users/users.module';

@NgModule({
	declarations: [MainMenuComponent, OrgMenuComponent, UserMenuComponent, NotificationComponent],
	imports: [CommonModule, AppRoutingModule, AngularSvgIconModule, SharedModule, RouterModule, NgxSmartModalModule.forRoot(), UsersModule],
	exports: [MainMenuComponent, OrgMenuComponent, UserMenuComponent, NotificationComponent],
	providers: [NotificationService]
})
export class MenuModule {}
