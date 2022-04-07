import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialFeedService } from './social-feed.service';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

@Component({
	selector: 'dm-social-feed',
	templateUrl: './social-feed.component.html',
	styleUrls: ['./social-feed.component.scss']
})
export class SocialFeedComponent implements OnInit {
	posts$: Observable<SocialMessageViewModel[]>;

	constructor(private service: SocialFeedService) {}

	ngOnInit() {
		this.posts$ = this.service.listPosts$();
	}
}
