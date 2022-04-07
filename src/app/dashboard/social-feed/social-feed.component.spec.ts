import { async, ComponentFixture, TestBed, flush, fakeAsync } from '@angular/core/testing';

import { SocialFeedComponent } from './social-feed.component';
import { SocialFeedService } from './social-feed.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ISocialFeedViewModel } from './social-feed.viewmodel';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

describe('SocialFeedComponent', () => {
	let component: SocialFeedComponent;
	let fixture: ComponentFixture<SocialFeedComponent>;
	let service: SocialFeedService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SocialFeedComponent],
			imports: [SharedModule, ApolloTestingModule],
			providers: [SocialFeedService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SocialFeedComponent);
		service = TestBed.get(SocialFeedService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should get all post from service', () => {
		const vms: SocialMessageViewModel[] = [
			{
				message:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod' +
					'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ',
				publishedOn: '1 hour ago',
				socialAccount: 'Facebook username',
			} as SocialMessageViewModel,
			{
				message:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod' +
					'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
					'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				publishedOn: '30 mins ago',
				socialAccount: 'Twitter username',
			} as SocialMessageViewModel
		];

		const posts = cold('a', { a: vms });
		spyOn(service, 'listPosts$').and.returnValue(posts);
		component.ngOnInit();
		fixture.detectChanges();

		getTestScheduler().flush();
		fixture.detectChanges();
		const listItems = fixture.nativeElement.querySelectorAll('li');
		expect(listItems.length).toBe(2);
	});
});
