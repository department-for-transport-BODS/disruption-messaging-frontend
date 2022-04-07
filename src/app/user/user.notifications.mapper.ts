import {Injectable} from '@angular/core';
import {IDisruptionNotificationNodeConnection} from 'src/generated/graphql';
import {UserNotificationViewModel} from './user.notification.view.model';
import {IdFormatter} from '../shared/formatters/id.formatter';
import {IDisruptionNotificationStatus, IDisruptionNotificationMessageType} from 'src/generated/enum-overrides';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class UserNotificationsMapper {
	toViewModel(notifications: IDisruptionNotificationNodeConnection): UserNotificationViewModel[] {
		if (!notifications.edges) {
			return [];
		}

		const vms = notifications.edges.map(e => {
			const disruption = e.node.details.disruption;
			const notification = e.node;
			const type = IDisruptionNotificationMessageType[notification.details.type];
			const sent = moment(notification.sent);
			const vm = {
				id: notification.id,
				disruptionId: IdFormatter.decodeBase64Id(disruption.id),
				type,
				status: IDisruptionNotificationStatus[notification.status],
				sent: sent.isValid() ? sent.fromNow() : '',
				message: notification.details.message || disruption.title,
				duplicates: e.node.details.duplicates.edges.map(edge => IdFormatter.decodeBase64Id(edge.node.id))
			};
			return vm;
		});

		return vms;
	}
}
