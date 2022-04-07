import { ValidityPeriodViewModel } from '../../shared/disruption-mapper/validity-period.viewmodel';
import { RelatedDisruptionViewModel } from 'src/app/shared/disruption-mapper/related-disruption.viewmodel';
import { ImpactViewModel } from 'src/app/shared/disruption-mapper/impact.viewmodel';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';
import { CommentViewModel } from 'src/app/shared/disruption-mapper/comment.viewmodel';

// TODO: Possible improvement is to store dates as Date objects in model and use pipes to format in templates
export interface ViewDisruptionViewModel {
	// This class represents all the fields necessary to view and review a disruption

	id: string;
	encodedId: string;
	title: string;
	isTemplate: boolean;
	description?: string;
	link?: string;
	type?: string;
	reason?: string;
	delay?: string;
	publishingStart?: string;
	publishingEnd?: string;
	severity?: string;
	status?: string;
	duration: string;

	validityPeriods?: ValidityPeriodViewModel[];
	relatedDisruptions?: RelatedDisruptionViewModel[];
	impacts?: ImpactViewModel[];
	socialMessages?: SocialMessageViewModel[];
	comments?: CommentViewModel[];
}
