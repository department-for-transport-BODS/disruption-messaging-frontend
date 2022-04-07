import { Component, OnInit, Input } from '@angular/core';
import { ViewDisruptionViewModel } from '../view-disruption.viewmodel';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

@Component({
	selector: 'dm-view-disruption-messaging',
	templateUrl: './messaging.component.html',
	styleUrls: ['./messaging.component.scss']
})
export class ViewDisruptionMessagingComponent implements OnInit {
	constructor() {}

	@Input() disruption: ViewDisruptionViewModel;

	ngOnInit(): void {}

	publishStatusMessage(msg: SocialMessageViewModel) {
		const error = msg.publishError;
		const publishedOn = msg.publishedOn;

		if (!msg.published) {
			return 'Pending';
		}

		if (error) {
			return `Publish failed: ${error}`;
		}

		const txt = 'Published';
		if (publishedOn) {
			return `${txt} on ${publishedOn}`;
		} else {
			return txt;
		}
	}
}
