import { ImpactViewModel } from '../../shared/disruption-mapper/impact.viewmodel';
import {SocialMessageViewModel} from '../../shared/disruption-mapper/social-message.viewmodel';
import {ValidityPeriodViewModel} from '../../shared/disruption-mapper/validity-period.viewmodel';

export interface DisruptionsGridRowViewModel {
	// This class represents a single (readonly) row in the Disruptions grid, with heavily summarised fields

	id: string;
	encodedId?: string;
	title: string;
	serviceModes: string;
	operatorWide: boolean;
	networkWide: boolean;
	servicesAffectedCount: number;
	stopsAffectedCount: number;
	startDate: string;
	endDate: string;
	severity: string;
	isLive: boolean;
	status: string;
	statusCode?: string;
}


export interface AllDisruptionFieldsGridRowViewModel {
	id: string;
	encodedId?: string;
	title: string;
	description: string;
	link: string;
	type: string;
	relatedDisruption: string;
	reason: string;
	isTemplate: string;
	publishingStart: string;
	publishingEnd: string;
	organisationName: string;
	isOpenEnded: string;
	deleted: string;
	approvedBy: string;
	relatedTo: string;
	createdBy: string;
	serviceModes: string;
	operatorWide: string;
	networkWide: string;
	servicesAffectedCount: number;
	stopsAffectedCount: number;
	validityPeriods: Array<ValidityPeriodViewModel>;
	severity: string;
	isLive: string;
	status: string;
	statusCode?: string;
	impacts: Array<ImpactViewModel>;
	socialMessages: Array<SocialMessageViewModel>;
}
