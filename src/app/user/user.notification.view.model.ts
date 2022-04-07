import { IDisruptionNotificationMessageType, IDisruptionNotificationStatus } from 'src/generated/enum-overrides';

export class UserNotificationViewModel {
	id: string;
	disruptionId: string;
	message: string;
	sent: string;
	status: IDisruptionNotificationStatus;
	type: IDisruptionNotificationMessageType;
	duplicates: Array<string>;
}
