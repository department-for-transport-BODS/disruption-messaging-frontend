import { Injectable } from '@angular/core';
import {
	IDisruptionCreateInput,
	IDisruptionDirectionEnum,
	IDisruptionImpactCreateInput,
	IDisruptionReasonInput,
	IDisruptionTypeInput,
	IDisruptionUpdateInput,
	IModeInput,
	IRelatedDisruptionInput,
	IRepetitionInput,
	ISeverityInput,
	ISocialMessageInput,
	IStopInput,
	IStopPointInput,
	ITransModelStopType,
	IValidityPeriodInput
} from 'src/generated/graphql';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DisruptionAutocompleteModel } from './overview/autocomplete-disruptions/disruption-autocomplete.model';
import { DateFormatter } from '../../shared/formatters/date.formatter';
import { IEditImpactViewModel, IEditSocialMessageViewModel, IEditValidityPeriodViewModel } from './edit-disruption.view.model';
import { DisruptionMapperBase } from 'src/app/shared/disruption-mapper/disruptions.mapper';
import { EnumFormatter } from 'src/app/shared/formatters/enum.formatter';
import { IImpactType } from 'src/app/shared/impact.type.enum';

@Injectable({
	providedIn: 'root'
})
export class IEditDisruptionGraphQLMapper extends DisruptionMapperBase {
	public toDisruptionInput(disruptionForm: FormGroup): any {
		const disruptionCreateInput = this.mapOverviewProps(disruptionForm);
		disruptionCreateInput.impact = this.mapImpacts(disruptionForm.get('impactGroup'));
		disruptionCreateInput.socialMessages = this.mapMessaging(disruptionForm.get('messagingGroup'));
		return disruptionCreateInput;
	}

	private mapOverviewProps(disruptionForm: FormGroup): IDisruptionCreateInput | IDisruptionUpdateInput {
		const overview = disruptionForm.value.overviewGroup;
		return {
			title: overview.summary,
			description: overview.description,
			link: overview.link,
			type: IDisruptionTypeInput[EnumFormatter.toEnumString(overview.disruptionType)] as IDisruptionTypeInput,
			reason: overview.reason ?
				IDisruptionReasonInput[EnumFormatter.toEnumString(overview.reason)] as IDisruptionReasonInput
				: IDisruptionReasonInput.Unknown,
			publishingStart: overview.publishingStart ? overview.publishingStart.toISOString() : null,
			publishingEnd: overview.publishingEnd ? overview.publishingEnd.toISOString() : null,
			relatedDisruption: this.mapRelatedDisruption(overview.related),
			validityPeriod: this.mapValidityPeriods(overview.validityPeriods, overview.isOpenEnded),
			isOpenEnded: overview.isOpenEnded || false
		};
	}

	private mapRelatedDisruption(related: DisruptionAutocompleteModel[]): IRelatedDisruptionInput[] {
		if (related == null || related.length === 0) {
			return [];
		}

		return related.map(model => ({ id: model.id }));
	}

	private mapValidityPeriods(
		validityPeriods: IEditValidityPeriodViewModel[],
		isOpenEnded: boolean
	): IValidityPeriodInput[] {
		if (validityPeriods && validityPeriods.length) {
			return validityPeriods
				.filter(f => f.startDate)
				.map((vp: IEditValidityPeriodViewModel) => {
					const period: IValidityPeriodInput = {
						startDate: DateFormatter.inputDate(vp.startDate.utc()),
						endDate: vp.endDate ? DateFormatter.inputDate(vp.endDate.utc()) : null,
						startTime: DateFormatter.inputTime(vp.startDate.utc()),
						endTime: vp.endDate ? DateFormatter.inputTime(vp.endDate.utc()) : null,
						repetition: vp.repeats ? IRepetitionInput[vp.repeats] : null,
						finalDate: vp.ending && vp.repeats && !isOpenEnded ? DateFormatter.inputDate(vp.ending) : null
					};

					if (vp.id) {
						period.id = vp.id;
					}
					return period;
				});
		}
		return [];
	}

	private mapImpacts(impactGroup: AbstractControl): IDisruptionImpactCreateInput[] {
		const impacts = impactGroup.value.impacts as IEditImpactViewModel[];
		if (impacts && impacts.length) {
			return impacts.map(i => {
				const mappedImpact = {
					advice: i.advice,
					delay: i.delay,
					severity: ISeverityInput[i.severity] as string,
					journeyPlanner: i.journeyPlanners === 'true',
					direction: i.direction ? ((i.direction as string) as IDisruptionDirectionEnum) : null,
					mode: IModeInput[i.mode] as string
				} as IDisruptionImpactCreateInput;
				if (i.id !== '') {
					mappedImpact.id = i.id;
				}
				if (i.type === IImpactType.Operator || i.type === IImpactType.Service) {
					mappedImpact.operators = i.operators
						? i.operators.map(op => ({ ref: op.entityId, name: op.name }))
						: [];
				} else {
					mappedImpact.operators = [];
				}
				if (i.type === IImpactType.Service) {
					mappedImpact.lines = i.lines
						? i.lines.map(line => ({
								ref: line.entityId,
								name: line.featureName,
								operatorIds: line.operatorEntityIds}))
						: [];
				} else {
					mappedImpact.lines = [];
				}
				if (i.type === IImpactType.Service || i.type === IImpactType.Stops) {
					mappedImpact.stops = i.stops.map((m: ITransModelStopType) => {
						const stop: IStopInput = {
							ref: m.entityId,
							longitude: parseFloat(m.lon),
							latitude: parseFloat(m.lat),
							commonName: m.featureName
						};
						//// TODO: remove temporary whilst we can't populate in line query.
						if (m.atcoCode !== null) {
							stop.atcoCode = m.atcoCode;
						}
						if (m.stopType !== null) {
							stop.type = IStopPointInput[EnumFormatter.toEnumString(m.stopType)] as IStopPointInput;
						}
						return stop;
					});
				} else {
					mappedImpact.stops = [];
				}
				return mappedImpact;
			});
		}
		return [];
	}

	private mapMessaging(messagingGroup: AbstractControl): ISocialMessageInput[] {
		const socialMessages: IEditSocialMessageViewModel[] = messagingGroup.value && messagingGroup.value.messages;
		if (socialMessages && socialMessages.length) {
			return socialMessages
				.filter(f => f.text && f.publishOn)
				.map((s: IEditSocialMessageViewModel) => {
					const msg: ISocialMessageInput = {
						message: s.text,
						image: s.image,
						socialAccount: s.socialAccount ? { id: s.socialAccount.id } : null,
						hootsuiteProfile: (
								s.socialAccount && s.socialAccount.isHootSuite && s.hootSuiteProfile
							) ? { id: s.hootSuiteProfile.id } : null,
						publishOn: s.publishOn.toISOString()
					};
					if (s.id) {
						msg.id = s.id;
					}
					return msg;
				});
		}
		return [];
	}
}
