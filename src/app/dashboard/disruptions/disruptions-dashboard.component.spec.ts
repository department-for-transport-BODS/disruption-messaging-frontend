import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { DisruptionsDashboardComponent } from './disruptions-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DisruptionsListModule } from '../../disruptions-list/disruptions-list.module';
import { DisruptionSummaryComponent } from './disruption-summary/disruption-summary.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DisruptionsDashboardService } from './disruptions-dashboard.service';
import { disruptionStatsRes } from './disruption-dashboard.testdata';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';

describe('DisruptionsDashboardComponent', () => {
	let component: DisruptionsDashboardComponent;
	let fixture: ComponentFixture<DisruptionsDashboardComponent>;
	let service: DisruptionsDashboardService;
	let querySpy;
	let obsRes;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [DisruptionsDashboardComponent, DisruptionSummaryComponent],
			imports: [
				SharedModule,
				DisruptionsListModule,
				ApolloTestingModule,
				FormsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				NgxSmartModalModule.forRoot()
			],
			providers: [DisruptionsDashboardService]
		}).compileComponents();
		obsRes = cold('-a|', { a: disruptionStatsRes });
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionsDashboardComponent);
		component = fixture.componentInstance;
		service = fixture.debugElement.injector.get(DisruptionsDashboardService);
		querySpy = spyOn(service, 'disruptionStats').and.returnValue(obsRes);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('renders disruptions table', fakeAsync(() => {
		expect(component.type).toEqual('live');
		component.ngOnInit();
		flush();
		fixture.detectChanges();
		expect(querySpy).toHaveBeenCalled();
	}));
});
