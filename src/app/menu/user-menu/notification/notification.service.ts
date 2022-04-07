import { Injectable } from '@angular/core';
import { IReadNotificationGQL } from 'src/generated/graphql';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
	constructor(private readNotification: IReadNotificationGQL) {}

	private notificationReadSubject = new BehaviorSubject<string>('');
	get notificationRead$() {
		return this.notificationReadSubject.asObservable();
	}

	markAsRead(id: string): void {
		this.readNotification.mutate({ id }).subscribe(result => {
			if (result.data.readNotification.success) {
				this.notificationReadSubject.next(result.data.readNotification.data.id);
			}
		});
	}
}
