import { async, ComponentFixture, TestBed, flush, fakeAsync } from '@angular/core/testing';

import { ActivityFeedComponent } from './activity-feed.component';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { AuditHistoryService } from 'src/app/audit/audit-history.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AuditHistoryViewModel } from 'src/app/audit/audit-history.viewmodel';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActivityFeedComponent', () => {
	let component: ActivityFeedComponent;
	let fixture: ComponentFixture<ActivityFeedComponent>;
	let service: AuditHistoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule, ApolloTestingModule, RouterTestingModule],
			declarations: [ActivityFeedComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ActivityFeedComponent);
		component = fixture.componentInstance;
		service = TestBed.get(AuditHistoryService);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should update history when subscription changes',() => {
		const historyViewModel: AuditHistoryViewModel[] = [
			{
				action: 'Updated',
				fieldChanges: [],
				contentType: 'Disruption',
				timestamp: '10:10:01',
				username: 'dsmith',
				timestampFromNow: 'an hour ago',
				objectRepr: 'Disruption named foo',
				objectId: 1
			}
		];
		const obs$ = cold('a|', { a: historyViewModel });

		spyOnProperty(service, 'auditHistory$').and.returnValue(obs$);

		component.ngOnInit();

		expect(component.auditHistoryLog$).toBe(obs$);

		getTestScheduler().flush();
	});
});
