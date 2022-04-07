import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import moment from 'moment';
import parseTweet from 'twitter-text/dist/parseTweet';

export const messagingRequiredValidator: ValidatorFn = (control: FormGroup): { [key: string]: boolean } | null => {
	const socialAccount = control.get('socialAccount');
	const hootSuiteProfile = control.get('hootSuiteProfile');
	const text = control.get('text');
	const publishOn = control.get('publishOn');
	const published = control.get('published');

	// If any one or more is set, all should be set.
	if (socialAccount.value || text.value || publishOn.value) {
		let allSet = socialAccount.value && text.value && publishOn.value;
		if (socialAccount.value && socialAccount.value.isHootSuite) {
			allSet = allSet && hootSuiteProfile.value;
		}
		return !allSet && !published.value ? { required: true } : null;

	}
	return null;
};

export const messagingPublishOnValidator: ValidatorFn = (control: FormGroup): { [key: string]: boolean } | null => {
	const socialAccount = control.get('socialAccount');
	const publishOn = control.get('publishOn');
	const published = control.get('published');

	if (!published.value && socialAccount.value && socialAccount.value.isHootSuite) {
		const fiveMinutesInFuture = moment().add(5, 'minutes');
		if (publishOn.value && publishOn.value.isBefore(fiveMinutesInFuture)) {
			return { incorrect_publish: true };
		}
	}
	return null;
};

export const twitterWeightMaxLengthFn =
	(maxLength: number): ValidatorFn => {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const tweet = parseTweet(control.value);
			if (tweet.weightedLength > maxLength) {
				return { maxlength: true };
			}
			return null;
		};
	};
