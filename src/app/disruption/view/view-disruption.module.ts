import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DeleteDisruptionModule } from '../delete/delete-disruption.module';

import { ViewDisruptionComponent } from './view-disruption.component';
import { ViewDisruptionService } from './view-disruption.service';

import { ViewDisruptionOverviewComponent } from './overview/overview.component';
import { BadgeComponent } from './overview/badge/badge.component';
import { ViewDisruptionImpactsComponent } from './impacts/impacts.component';
import { ViewDisruptionMessagingComponent } from './messaging/messaging.component';
import { ApproveDisruptionComponent } from './approve/approve-disruption.component';
import { ReviewDisruptionService } from './approve/review-disruption.service';

@NgModule({
	declarations: [
		ViewDisruptionComponent,
		ViewDisruptionOverviewComponent,
		ViewDisruptionImpactsComponent,
		ViewDisruptionMessagingComponent,
		ApproveDisruptionComponent,
		BadgeComponent
	],
	imports: [FormsModule, CommonModule, SharedModule, RouterModule, DeleteDisruptionModule, NgxSmartModalModule],
	exports: [ViewDisruptionComponent],
	providers: [ViewDisruptionService, ReviewDisruptionService]
})
export class ViewDisruptionModule {}
