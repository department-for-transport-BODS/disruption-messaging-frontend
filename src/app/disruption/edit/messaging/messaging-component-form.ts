import * as moment from 'moment';
import { Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProfanityValidatorFn } from '../../../shared/validators/profanity.validator';
import { twitterWeightMaxLengthFn } from './messaging.validator';
import { ISocialAccountViewModel } from '../../../social/social.view.model';
import { IHootSuiteProfileType } from 'src/generated/graphql';

export class MessagingComponentForm {
	id: (string | ((control: AbstractControl) => ValidationErrors))[];
	socialAccount: (ISocialAccountViewModel | ((control: AbstractControl) => ValidationErrors))[];
	hootSuiteProfile: (IHootSuiteProfileType | ((control: AbstractControl) => ValidationErrors))[];
	text: (string | ((control: AbstractControl) => ValidationErrors)[])[];
	image: (File | ((control: AbstractControl) => ValidationErrors))[];
	publishOn: (moment.Moment | ((control: AbstractControl) => ValidationErrors))[];
	publishedOn: (string)[];
	lastPublishError: (string)[];
	published: (boolean)[];

	constructor() {
		this.id = [''];
		this.socialAccount = [];
		this.hootSuiteProfile = [];
		this.text = ['', [twitterWeightMaxLengthFn(280), ProfanityValidatorFn()]];
		this.image = null;
		this.publishOn = [];
		this.published = [];
		this.publishedOn = [];
		this.lastPublishError = [];
	}
}
