import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ISocialMessagesGQL } from 'src/generated/graphql';
import { filter, map } from 'rxjs/operators';
import { SocialFeedViewModelMapper } from './social-feed.viewmodel.mapper';
import { environment } from '../../../environments/environment';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

@Injectable({
	providedIn: 'root'
})
export class SocialFeedService {
	constructor(private socialFeedGQL: ISocialMessagesGQL, private mapper: SocialFeedViewModelMapper) {}

	listPosts$(): Observable<SocialMessageViewModel[]> {
		return this.socialFeedGQL
			.watch({}, {pollInterval: environment.pollInterval})
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(
				map(res => res.data.socialMessages.edges.map(
					msg => this.mapper.toViewModel(msg.node))
				)
			);
	}
}
