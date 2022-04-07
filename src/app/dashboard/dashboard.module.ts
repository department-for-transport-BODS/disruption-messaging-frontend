import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { DisruptionsDashboardComponent } from './disruptions/disruptions-dashboard.component';
import { DisruptionSummaryComponent } from './disruptions/disruption-summary/disruption-summary.component';
import { SharedModule } from '../shared/shared.module';
import { ReviewsDashboardComponent } from './reviews/reviews-dashboard.component';
import { FormsModule } from '@angular/forms';
import { SocialFeedComponent } from './social-feed/social-feed.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';

@NgModule({
	declarations: [
		DashboardComponent,
		DisruptionsDashboardComponent,
		DisruptionSummaryComponent,
		ReviewsDashboardComponent,
		SocialFeedComponent,
		ActivityFeedComponent
	],
	imports: [CommonModule, RouterModule, BrowserModule, SharedModule, FormsModule],
	exports: [DashboardComponent]
})
export class DashboardModule {}
