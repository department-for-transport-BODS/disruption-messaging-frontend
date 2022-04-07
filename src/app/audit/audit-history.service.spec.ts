import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { ILogEntryAction, IDisruptionAuditByIdGQL } from 'src/generated/graphql';
import { AuditHistoryChanges, AuditHistoryViewModel } from './audit-history.viewmodel';
import { AuditHistoryMapper } from './audit-history.mapper';
import { AuditHistoryService } from './audit-history.service';

describe('DisruptionsListService', () => {
	let apolloController: ApolloTestingController;
	let auditHistoryService: AuditHistoryService;
	let mapper: AuditHistoryMapper;
	const audit: any = {
		edges: [
			{
				node: {
					id: '12',
					actor: { id: 'id', username: 'username' },
					action: ILogEntryAction.A_0,
					contentType: { id: 'id', name: 'username' },
					changedFields: [{ field: 'f', oldValue: 'o', newValue: 'n' }],
					timestamp: '2019-10-10',
					objectPk: '123'
				},
				cursor: null
			}
		],
		pageInfo: null,
		totalCount: 10
	};

	const historyViewModel: AuditHistoryViewModel = {
		action: 'Updated',
		fieldChanges: [],
		contentType: 'Disruption',
		link: '2323123',
		timestamp: '10:10:01',
		username: 'dsmith',
		timestampFromNow: 'an hour ago',
		objectRepr: 'Disruption named foo',
		objectId: 1
	};

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IDisruptionAuditByIdGQL, AuditHistoryService, AuditHistoryMapper]
		}).compileComponents()
	);

	beforeEach(() => {
		apolloController = TestBed.get(ApolloTestingController);
		mapper = TestBed.get(AuditHistoryMapper);
		auditHistoryService = TestBed.get(AuditHistoryService);
		spyOn(mapper, 'toViewModel').and.returnValue(historyViewModel);
	});

	afterEach(() => {
		apolloController.verify();
	});

	it('should fetch and map the results to view model', fakeAsync(() => {
		const id = '1';

		auditHistoryService.setAuditHistoryForDisruption(id);

		const disruptionAuditById = apolloController.expectOne('disruptionAuditById');
		expect(disruptionAuditById.operation.variables.id).toEqual(id);
		disruptionAuditById.flush({
			data: {
				disruptionAudit: audit
			}
		});

		flush();

		auditHistoryService.auditHistory$.subscribe(res => {
			expect(mapper.toViewModel).toHaveBeenCalledWith(audit.edges[0].node);
			expect(res).toEqual([historyViewModel]);
		});
	}));

	it('should remove disruption on unload', fakeAsync(() => {
		// setup the disruption$ with value.
		auditHistoryService.setAuditHistoryForDisruption('1');

		const disruptionAuditById = apolloController.expectOne('disruptionAuditById');
		expect(disruptionAuditById.operation.variables.id).toEqual('1');
		disruptionAuditById.flush({
			data: {
				disruptionAudit: audit
			}
		});
		flush();

		// now unload and test.
		auditHistoryService.clearDisruption();

		auditHistoryService.auditHistory$.subscribe(val => {
			expect(val).toBe(null);
		});
	}));
});
