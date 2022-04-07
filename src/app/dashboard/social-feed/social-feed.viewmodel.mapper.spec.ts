import { ISocialRegistrationAccountType } from 'src/generated/graphql';
import { SocialFeedViewModelMapper } from './social-feed.viewmodel.mapper';
import * as moment from 'moment';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';

describe('socialFeedViewModelMapper', () => {
	let apiResponse: any;
	const socialAccountViewModelMapper = new SocialFeedViewModelMapper();

	beforeEach(() => {
		apiResponse = {
			edges: [
				{
					node: {
						id: '123',
						socialAccount: {
							username: 'fb_user',
							facebookPages: [{ name: 'page1', id: 'p1' }],
							accountType: 'A_2' as ISocialRegistrationAccountType,
							prettyName: 'fb_pretty'
						},
						publishedOn: '2019-10-01T10:10:12',
						message: 'A test message for facebook'
					}
				},
				{
					node: {
						id: '456',
						socialAccount: {
							username: 'twitter_user',
							facebookPages: null,
							accountType: 'A_1' as ISocialRegistrationAccountType,
							prettyName: 'twitter-pretty'
						},
						publishedOn: '2019-10-02T10:10:12',
						message: 'A test message for twitter'
					}
				},
				{
					node: {
						id: '456',
						socialAccount: null,
						publishedOn: '2019-10-02T10:10:12',
						message: 'A test message for twitter'
					}
				}
			]
		};
	});

	describe('facebook posts', () => {
		let result: SocialMessageViewModel;
		beforeEach(() => {
			result = socialAccountViewModelMapper.toViewModel(apiResponse.edges[0].node);
		});

		it('should map message', () => {
			expect(result.message).toBe('A test message for facebook');
		});

		it('should map username', () => {
			expect(result.socialAccount).toBe('page1 (Facebook)');
		});

		it('should map published on', () => {
			expect(result.publishedOn).toBe(moment('2019-10-01T10:10:12').fromNow());
		});

	});

	describe('twitter posts', () => {
		let result: SocialMessageViewModel;
		beforeEach(() => {
			result = socialAccountViewModelMapper.toViewModel(apiResponse.edges[1].node);
		});

		it('should map message', () => {
			expect(result.message).toBe('A test message for twitter');
		});

		it('should map published on', () => {
			expect(result.publishedOn).toBe(moment('2019-10-02T10:10:12').fromNow());
		});

		it('should map twitter username as empty', () => {
			expect(result.socialAccount).toBe('twitter-pretty (Twitter)');
		});
	});

	it('should map without social account', () => {
		const result = socialAccountViewModelMapper.toViewModel(apiResponse.edges[2].node);

		expect(result.socialAccount).toBe('<i>Account removed</i>');
	});
});
