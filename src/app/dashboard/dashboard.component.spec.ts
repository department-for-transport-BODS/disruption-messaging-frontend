import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GeojsonMapper } from '../shared/components/map/disruptions-map.geojson.mapper';
import { DisruptionsListService } from '../disruptions-list/disruptions-list.service';
import { DisruptionsListModule } from '../disruptions-list/disruptions-list.module';
import { SharedModule } from '../shared/shared.module';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { DisruptionsDashboardComponent } from './disruptions/disruptions-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReviewsDashboardComponent } from './reviews/reviews-dashboard.component';
import { DisruptionSummaryComponent } from './disruptions/disruption-summary/disruption-summary.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialFeedComponent } from './social-feed/social-feed.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';

describe('DashboardComponent', () => {
	let component: DashboardComponent;
	let fixture: ComponentFixture<DashboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				DashboardComponent,
				DisruptionsDashboardComponent,
				ReviewsDashboardComponent,
				DisruptionSummaryComponent,
				SocialFeedComponent,
				ActivityFeedComponent
			],
			imports: [
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				SharedModule,
				DisruptionsListModule,
				ApolloTestingModule,
				RouterTestingModule,
				CommonModule,
				FormsModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [GeojsonMapper, DisruptionsListService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
