import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDisruptionNodeConnection, IExportDisruptionsListGQL } from 'src/generated/graphql';
import { DisruptionsFilterParameters } from './filter/disruptions-filter-parameters.class';
import { Injectable } from '@angular/core';
import { DisruptionsGridMapper } from './grid/disruptions-grid.mapper';
import { DisruptionsGridModel } from './grid/disruptions-grid.model';
import { EnumFormatter } from '../shared/formatters/enum.formatter';
import { AllDisruptionFieldsGridRowViewModel } from './grid/disruptions-gridrow.viewmodel';

@Injectable({
providedIn: 'root'
})
export class ExportAllFieldsService {
	loading = true;
	data: AllDisruptionFieldsGridRowViewModel[];
	impactFields = ['id', 'advice', 'name', 'severity', 'mode', 'type', 'delay', 'operatorNames', 'lineNames', 'stopAtcos',
	'journeyPlanner', 'direction', 'allOperators'];
	socialFields = ['message', 'image', 'socialAccount', 'hootSuiteProfile', 'publishDateTime',	'publishedOn', 'status'];
	validityFields = ['startDate', 'endDate', 'repetition',	'repetitionEnd', 'startTime', 'endTime' ];

	constructor(
		private disruptionListGQL: IExportDisruptionsListGQL,
		private disruptionsMapper: DisruptionsGridMapper

	) {}


	getAllDisruptionFields(filters?: DisruptionsFilterParameters): Observable<AllDisruptionFieldsGridRowViewModel[]> {
		return this.disruptionListGQL
			.fetch({
				status: filters.status,
				severity: filters.severity,
				mode: filters.mode,
				operators: filters.operators,
				lines: filters.lines,
				startDate: filters.startDate,
				endDate: filters.endDate,
				titleFilter: filters.searchText,
				isTemplate: filters.isTemplate,
			})
			.pipe(
				map(result => {
					return this.disruptionsMapper.getExportAllFieldsModel(
						result.data.allDisruptions as IDisruptionNodeConnection);
					}
				)
			);
	}

	listAllDisruptionFields(filters?: DisruptionsFilterParameters): void {
		this.data = [];
		this.getAllDisruptionFields(filters).pipe(take(1)).subscribe(disgrid => {
			this.data = disgrid;
		});
	}

	fillNestedData(type, data, index, csvData, dataIndex) {
		const fields = (type === 'impact') ? this.impactFields : (type === 'social' ? this.socialFields : this.validityFields);
		for (const key of fields) {
			const keyName = type + (index + 1) + ' ' + key;
			csvData[dataIndex][keyName] = data ? (data[key] ? data[key] : '') : '';
		}
		return csvData;
	}


	fillData() {
		let allFieldsData = this.data.map(x => Object.assign({}, x));

		const maxImpactsLength = Math.max(...allFieldsData.map(edge => edge.impacts.length));

		const maxSocialMessagesLength = Math.max(...allFieldsData.map(edge => edge.socialMessages.length));
		const maxValidityPeriodsLength = Math.max(...allFieldsData.map(edge => edge.validityPeriods.length));

		allFieldsData.forEach((data, dataIndex) => {
			const arrImpacts = data.impacts;
			delete data.impacts;

			arrImpacts.forEach((impact, impactIndex) => {
				allFieldsData = this.fillNestedData('impact', impact, impactIndex, allFieldsData, dataIndex);
			});

			if (arrImpacts.length < maxImpactsLength) {
				// impacts is less than max number of impacts in other disruptions
				for (let index = arrImpacts.length; index < maxImpactsLength; index++) {
					allFieldsData = this.fillNestedData('impact', null, index, allFieldsData, dataIndex);
				}
			}

			const arrSocialMessages = data.socialMessages;
			delete data.socialMessages;

			arrSocialMessages.forEach((social, socialIndex) => {
				allFieldsData = this.fillNestedData('social', social, socialIndex, allFieldsData, dataIndex);
			});

			if (arrSocialMessages.length < maxSocialMessagesLength) {
				// social messages is less than max number of social messages in other disruptions
				for (let index = arrSocialMessages.length; index < maxSocialMessagesLength; index++) {
					allFieldsData = this.fillNestedData('social', null, index, allFieldsData, dataIndex);
				}
			}

			const arrValidityPeriods = data.validityPeriods;
			delete data.validityPeriods;

			arrValidityPeriods.forEach((validityPeriod, validityIndex) => {
				allFieldsData = this.fillNestedData('validity', validityPeriod, validityIndex, allFieldsData, dataIndex);
			});

			if (arrValidityPeriods.length < maxValidityPeriodsLength) {
				// validity periods is less than max number of validity periods in other disruptions
				for (let index = arrValidityPeriods.length; index < maxValidityPeriodsLength; index++) {
					allFieldsData = this.fillNestedData('validity', null, index, allFieldsData, dataIndex);
				}
			}
		});
		return allFieldsData;
	}
}

