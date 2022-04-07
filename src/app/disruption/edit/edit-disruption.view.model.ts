import { DisruptionAutocompleteModel } from './overview/autocomplete-disruptions/disruption-autocomplete.model';
import * as moment from 'moment';
import { IDisruptionImpactDirection, ITransModelStopType, IHootSuiteProfileType, IImageType } from 'src/generated/graphql';
import { ISocialAccountViewModel } from '../../social/social.view.model';
import { IDisruptionImpactDirectionReverse } from 'src/generated/enum-overrides';

export interface IEditDisruptionViewModel {
	id: string;
	decodedId?: string;
	summary: string;
	description?: string;
	link?: string;
	disruptionType?: string;
	reason?: string;
	isTemplate?: boolean;
	related?: DisruptionAutocompleteModel[];
	publishingStart?: moment.Moment;
	publishingEnd?: moment.Moment;
	isOpenEnded?: boolean;
	validityPeriods?: IEditValidityPeriodViewModel[];
	impacts?: IEditImpactViewModel[];
	socialMessages?: IEditSocialMessageViewModel[];
}

export interface IEditValidityPeriodViewModel {
	id?: string;
	startDate?: moment.Moment;
	endDate?: moment.Moment;
	repeats?: string;
	ending?: moment.Moment;
	description?: string;
}

export interface IEditImpactViewModel {
	id?: string;
	mode: string;
	advice: string;
	journeyPlanners: string;
	delay: number;
	severity: string;
	type: string;
	direction?: IDisruptionImpactDirectionReverse;
	operators: [{ name: string; entityId: string }];
	lines: [{ featureName: string; entityId: string, operatorEntityIds: []}];
	stops: [ITransModelStopType];
}

export interface IEditSocialMessageViewModel {
	id?: string;
	socialAccount: ISocialAccountViewModel;
	hootSuiteProfile: IHootSuiteProfileType;
	text: string;
	image: IImageType;
	publishOn: moment.Moment;
	published: boolean;
	publishedOn: moment.Moment;
	lastPublishedError: string;
}
