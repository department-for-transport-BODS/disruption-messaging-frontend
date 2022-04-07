import { INotificationTypeEnum } from 'src/generated/graphql';

export interface INotificationSettingsViewModel {
	inApp: boolean;
	email: boolean;
	notificationType: INotificationTypeEnum;
}
