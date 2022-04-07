import { SocialFeedService } from './social-feed.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SocialFeedViewModelMapper } from './social-feed.viewmodel.mapper';
import { ISocialMessageType, ISocialAccountType, ISocialAccountAccountType } from 'src/generated/graphql';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

describe('SocialService', () => {
	let service: SocialFeedService;
	let controller: ApolloTestingController;
	let viewModelMapper: SocialFeedViewModelMapper;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, HttpClientModule],
			declarations: [],
			providers: [SocialFeedService]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(SocialFeedService);
		viewModelMapper = TestBed.get(SocialFeedViewModelMapper);
	});

	const vms: SocialMessageViewModel[] = [{
		publishedOn: '01/01/2019 10:10',
		message: 'this one',
		socialAccount: 'fb_pretty',
		hootSuiteProfile: null,
		published: false,
	} as SocialMessageViewModel, {
		publishedOn: '01/01/2019 10:10',
		message: 'this one',
		socialAccount: 'twitter_pretty',
		hootSuiteProfile: null,
		published: false,
	} as SocialMessageViewModel];
	const posts = [
		{
			node: {
				id: '123',
				socialAccount: {
					id: '1234',
					username: 'fb_user',
					facebookPages: [{ name: 'page1', id: 'p1' }],
					accountType: 'A_2' as ISocialAccountAccountType,
					prettyName: 'fb_pretty',
					email: 'foo@fb.com',
					createdBy: null,
					hootsuiteProfiles: null,
					__typename: 'SocialAccountType'
				} as ISocialAccountType,
				publishedOn: '2019-10-01T10:10:12',
				message: 'A test message for facebook',
				image: null,
				hootsuiteProfile: null
			} as ISocialMessageType
		},
		{
			node: {
				id: '456',
				socialAccount: {
					id: '1234',
					username: 'twitter_user',
					facebookPages: null,
					accountType: 'A_1' as ISocialAccountAccountType,
					prettyName: 'handle',
					email: 'foo@twitter.com',
					createdBy: null,
					hootsuiteProfiles: null,
					__typename: 'SocialAccountType'
				} as ISocialAccountType,
				publishedOn: '2019-10-02T10:10:12',
				message: 'A test message for twitter',
				image: null,
				hootsuiteProfile: null
			} as ISocialMessageType
		}
	];

	it('should get all social posts', done => {
		spyOn(viewModelMapper, 'toViewModel').and.returnValues(vms[0], vms[1]);

		service.listPosts$().subscribe(acc => {
			expect(acc[0]).toBe(vms[0]);
			expect(acc[1]).toBe(vms[1]);
			expect(acc.length).toBe(2);
			done();
		});

		controller.expectOne('socialMessages').flush({
			data: { socialMessages: { edges: posts } }
		});
		controller.verify();
	});
});
