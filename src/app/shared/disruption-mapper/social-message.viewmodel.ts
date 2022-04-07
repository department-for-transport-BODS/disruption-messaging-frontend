import { ISocialMessageType, ISocialAccountType, ISocialAccountAccountType, IHootSuiteProfileType } from 'src/generated/graphql';
import { DateFormatter } from '../formatters/date.formatter';
import { ISocialRegistrationAccountType, IHootSuiteProfileProfileType } from 'src/generated/enum-overrides';

export class SocialMessageViewModel {
	message: string;
	socialAccount: string;
	hootSuiteProfile: string;
	publishDateTime: string;
	published: boolean;
	publishError: string;
	publishedOn: string;
	status: string;
	image: any;

	constructor(gqlMessage: ISocialMessageType) {
		this.message = gqlMessage.message;
		this.image = gqlMessage.image;
		this.socialAccount = this.formatAccountName(gqlMessage.socialAccount);
		this.hootSuiteProfile = this.formatHootSuiteProfile(gqlMessage.hootsuiteProfile);
		this.publishDateTime = DateFormatter.shortDateAndTime(gqlMessage.publishOn);
		this.published = gqlMessage.published;
		this.publishedOn = DateFormatter.shortDateAndTime(gqlMessage.publishedOn);
		this.publishError = gqlMessage.lastPublishError;
		this.status = this.getStatus(gqlMessage.published, gqlMessage.lastPublishError, gqlMessage.publishedOn);
	}

	private getStatus(published: boolean, lastPublishError: string, publishedOn: string) {
		const status = 'Published';
		if (!published) {
			return 'Pending';
		}
		if (lastPublishError) {
			return `Publish failed: ${lastPublishError}`;
		}
		if (publishedOn) {
			return `${status} on ${DateFormatter.shortDateAndTime(publishedOn)}`;
		} else {
		return status;
		}
	}

	private formatAccountName(acc: ISocialAccountType): string {
		if (!acc) {
			return '<i>Account removed</i>';
		}
		let username = acc.username;
		switch (acc.accountType) {
			case ISocialAccountAccountType.A_1:  // Twitter
				username = acc.prettyName;
				break;
			case  ISocialAccountAccountType.A_2:  // Facebook
				username = acc.facebookPages[0].name;
				break;
			case ISocialAccountAccountType.A_3:  // HootSuite
				username = acc.email;
				break;
			default:
				username = acc.username;
		}
		return acc ? `${username} (${ISocialRegistrationAccountType[acc.accountType]})` : '';
	}

	private formatHootSuiteProfile(profile: IHootSuiteProfileType): string {
		if (!profile) {
			return null;
		}
		let profileDisplay = null;
		const profileType = IHootSuiteProfileProfileType[profile.profileType];
		switch (profileType) {
			case IHootSuiteProfileProfileType.A_1:  // Twitter
				profileDisplay = `<a href="https://twitter.com/i/user/${profile.socialId}">Twitter ID: ${profile.socialId.slice(0, 8)}...</a>`;
				break;
			case IHootSuiteProfileProfileType.A_2:  // Facebook
				profileDisplay = `<span style="white-space:nowrap">Facebook page: ${profile.socialUsername}</span>`;
				break;
			default:
				profileDisplay = profile.socialUsername;
		}
		return `${profileDisplay}`;
	}
}
