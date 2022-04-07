import { ILogEntryAction } from 'src/generated/graphql';
import * as moment from 'moment';
import { AuditHistoryMapper } from './audit-history.mapper';
import { AuditHistoryChanges } from './audit-history.viewmodel';

describe('map DisruptionHistoryViewModel', () => {
	let gqlNode: any;
	const mapper = new AuditHistoryMapper();

	beforeEach(() => {
		gqlNode = {
			action: ILogEntryAction.A_1,
			contentType: { name: 'Disruption', id: '1' },
			changedFields: [
				{
					field: 'last_published_error',
					oldValue: '"null"',
					newValue: '"a longer string with some information"'
				},
				{
					field: 'published_status',
					oldValue: '"false"',
					newValue: '"true"'
				}
			],
			objectPk: '122',
			timestamp: '2019-10-31T10:10:00'
		};
	});

	it('should map message from action and content type', () => {
		const res = mapper.toViewModel(gqlNode);
		expect(res.contentType).toBe('Disruption');
	});

	it('should map action', () => {
		const res = mapper.toViewModel(gqlNode);
		expect(res.action).toBe('Updated');
	});

	it('should map empty username as system user', () => {
		const res = mapper.toViewModel(gqlNode);
		expect(res.username).toBe('System');
	});

	it('should map username', () => {
		gqlNode.actor = { username: 'dsmith' };
		const res = mapper.toViewModel(gqlNode);
		expect(res.username).toBe('dsmith');
	});

	it('should map field changes', () => {
		const res = mapper.toViewModel(gqlNode);
		const changes: AuditHistoryChanges[] = [{
			field: 'last published error',
			action: 'Changed',
			oldValue: 'null',
			newValue: 'a longer string with some information',
		}, {
			field: 'published status',
			action: 'Changed',
			oldValue: 'false',
			newValue: 'true',
		}];
		expect(res.fieldChanges[0]).toEqual(changes[0]);
		expect(res.fieldChanges[1]).toEqual(changes[1]);
	});

	it('should map timestamp', () => {
		const res = mapper.toViewModel(gqlNode);
		expect(res.timestamp).toBe('31/10/2019 10:10:00');
	});

	it('should create link if disruption', () => {
		gqlNode.contentType.name = 'Disruption';
		gqlNode.objectPk = '123';

		const res = mapper.toViewModel(gqlNode);
		expect(res.link).toBe('/disruption/123');
	});

	it('should map from now', () => {
		const fromnow = moment('2019-10-31T10:10:00').fromNow();
		const res = mapper.toViewModel(gqlNode);
		expect(res.timestampFromNow).toBe(fromnow);
	});
});
