import { UserNotificationsMapper } from './user.notifications.mapper';
import * as moment from 'moment';
import { IDisruptionNotificationMessageType, IDisruptionNotificationStatus } from 'src/generated/enum-overrides';
import { IdFormatter } from '../shared/formatters/id.formatter';

describe('UserNotificationMapper', () => {
	const mapper = new UserNotificationsMapper();

	it('should map to view model', () => {
		const nodeconnection: any = {
			edges: [
				{
					node: {
						id: 'RGlzcnVwdGlvbk5vdGlmaWNhdGlvbk5vZGU6ODY=',
						details: {
							disruption: {
								id: 'RGlzcnVwdGlvbk5vdGlmaWNhdGlvbk5vZGU6NA==',
								title: 'titles, titles, titles'
							},
							message: 'This notification is a test one.',
							type: 'A_1' as IDisruptionNotificationMessageType,
							duplicates: {
								edges: []
							}
						},
						sent: moment.now(),
						status: 'A_1' as IDisruptionNotificationStatus
					}
				}
			],
			totalCount: 10
		};

		const vms = mapper.toViewModel(nodeconnection);

		const firstResult = vms[0];

		expect(firstResult.disruptionId).toBe('4');
		expect(firstResult.id).toBe(nodeconnection.edges[0].node.id);
		expect(firstResult.message).toBe(nodeconnection.edges[0].node.details.message);
		expect(firstResult.sent).toBe('a few seconds ago');
		expect(firstResult.status).toBe('Unread');
		expect(firstResult.type).toBe('Disruption approved');
	});

	it('should return empty when no nodes', () => {
		const nodeconnection: any = {
			edges: [],
			totalCount: 10
		};
		expect(mapper.toViewModel(nodeconnection)).toBeTruthy();
	});

	it('should use the disruption title when message is null', () => {
		const nodeconnection: any = {
			edges: [
				{
					node: {
						details: {
							disruption: {
								id: 'RGlzcnVwdGlvbk5vZGU6ODY=',
								title: 'titles, titles, titles'
							},
							message: null,
							type: 'A_1' as IDisruptionNotificationMessageType,
							duplicates: {
								edges: []
							}
						},
						sent: moment.now(),
						status: 'A_1' as IDisruptionNotificationStatus
					}
				}
			],
			totalCount: 10
		};
		const vm = mapper.toViewModel(nodeconnection);
		expect(vm[0].message).toBeTruthy('Disruption approved: titles, titles, titles');
	});

	it('should map duplicates', () => {
		const nodeconnection: any = {
			edges: [
				{
					node: {
						details: {
							disruption: {
								id: 'RGlzcnVwdGlvbk5vZGU6ODY=',
								title: 'titles, titles, titles'
							},
							message: null,
							type: 'A_3' as IDisruptionNotificationMessageType,
							duplicates: {
								edges: [
									{
										node: {
											id: 'RGlzcnVwdGlvbk5vZGU6ODZ='
										}
									}
								]
							}
						},
						sent: moment.now(),
						status: 'A_1' as IDisruptionNotificationStatus
					}
				}
			],
			totalCount: 10
		};
		const vm = mapper.toViewModel(nodeconnection);
		expect(vm[0].duplicates).toEqual([IdFormatter.decodeBase64Id('RGlzcnVwdGlvbk5vZGU6ODZ=')]);
	});
});
