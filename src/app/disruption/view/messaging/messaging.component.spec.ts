import { ViewDisruptionMessagingComponent } from './messaging.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';
import { ISocialMessageType, ISocialAccountAccountType, ISocialAccountType } from 'src/generated/graphql';
import { IHootSuiteProfileProfileType } from 'src/generated/enum-overrides';

describe('Messaging component', () => {
	let component: ViewDisruptionMessagingComponent;
	let fixture: ComponentFixture<ViewDisruptionMessagingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ViewDisruptionMessagingComponent],
			imports: [],
			providers: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewDisruptionMessagingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display publish error', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: '20109-10-29T10:10:12',
			lastPublishError: 'Something went wrong',
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '20109-10-29T10:105:12'
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		const result = component.publishStatusMessage(viewModel);

		expect(result).toBe('Publish failed: Something went wrong');
	});

	it('should display pending', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: false,
			message: 'This has not been published yet',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '20109-10-29T10:105:12'
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		const result = component.publishStatusMessage(viewModel);

		expect(result).toBe('Pending');
	});

	it('should display publish success with time', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: '2019-10-29T10:10:12',
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00'
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		const result = component.publishStatusMessage(viewModel);

		expect(result).toBe('Published on 29/10/2019 10:10:12');
	});

	it('should display publish success without date', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00'
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		const result = component.publishStatusMessage(viewModel);

		expect(result).toBe('Published');
	});

	it('should display facebook name', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00',
			socialAccount: {
				accountType: ISocialAccountAccountType.A_2,
				facebookPages: [
					{
						id: '1',
						pageId: '122',
						name: 'MyFBPage'
					}
				],
				accessToken: '',
				accessTokenSecret: '',
				modified: '',
				id: '',
				created: '',
				createdBy: null,
				username: 'Jayden',
				hootsuiteProfiles: null,
				socialMessages: null
			} as ISocialAccountType
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		expect(viewModel.socialAccount).toBe('MyFBPage (Facebook)');
	});

	it('should display twitter name', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00',
			socialAccount: {
				accountType: ISocialAccountAccountType.A_1,
				facebookPages: null,
				accessToken: '',
				accessTokenSecret: '',
				modified: '',
				id: '',
				created: '',
				createdBy: null,
				prettyName: 'Jayden Pretty',
				username: 'Jayden',
				hootsuiteProfiles: null,
				socialMessages: null
			} as ISocialAccountType
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		expect(viewModel.socialAccount).toBe('Jayden Pretty (Twitter)');
	});

	it('should display Twitter HootSuite account', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00',
			socialAccount: {
				accountType: ISocialAccountAccountType.A_3,
				accessToken: '',
				accessTokenSecret: '',
				modified: '',
				id: '',
				created: '',
				createdBy: null,
				username: 'HootSuite',
				hootsuiteProfiles: null,
				socialMessages: null
			} as ISocialAccountType,
			hootsuiteProfile: {
				id: '111',
				profileType: 'A_1' as IHootSuiteProfileProfileType,
				profileId: '1234',
				socialId: '12345',
				socialUsername: null,
				socialMessages: null
			}
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		expect(viewModel.hootSuiteProfile).toBe('<a href="https://twitter.com/i/user/12345">Twitter ID: 12345...</a>');
	});

	it('should display Facebook HootSuite account', () => {
		const graphQlMessage: ISocialMessageType = {
			publishedOn: null,
			lastPublishError: null,
			published: true,
			message: '',
			image: null,
			id: '1',
			disruption: null,
			publishOn: '2019-10-30T10:05:00',
			socialAccount: {
				accountType: ISocialAccountAccountType.A_3,
				accessToken: '',
				accessTokenSecret: '',
				modified: '',
				id: '',
				created: '',
				createdBy: null,
				username: 'HootSuite',
				hootsuiteProfiles: null,
				socialMessages: null
			} as ISocialAccountType,
			hootsuiteProfile: {
				id: '111',
				profileType: 'A_2' as IHootSuiteProfileProfileType,
				profileId: '1234',
				socialId: '12345',
				socialUsername: 'a-facebook-user',
				socialMessages: null
			}
		};
		const viewModel = new SocialMessageViewModel(graphQlMessage);

		expect(viewModel.hootSuiteProfile).toBe('<span style="white-space:nowrap">Facebook page: a-facebook-user</span>');
	});
});
