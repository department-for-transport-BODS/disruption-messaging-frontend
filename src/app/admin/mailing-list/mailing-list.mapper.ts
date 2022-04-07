import {Injectable} from '@angular/core';
import { IMailingListInput, IMailingListType, IOrganisationInput } from 'src/generated/graphql';
import { MailingListViewmodel } from './mailing-list.viewmodel';
import { ViewModelMapper } from '../../shared/types/viewmodel-mapper';
import { GraphQLMapper } from '../../shared/types/graphql-mapper';
import { FormGroup } from '@angular/forms';
import { OrganisationMapper } from '../organisation/organisation.mapper';
import { EnumFormatter } from '../../shared/formatters/enum.formatter';

@Injectable({
	providedIn: 'root'
})

export class MailingListMapper
		implements ViewModelMapper<IMailingListType, MailingListViewmodel>,
			GraphQLMapper<IMailingListInput> {
	constructor(private organisationMapper: OrganisationMapper) {}

	getModel(gqlNode: IMailingListType): MailingListViewmodel {
		return {
			id: gqlNode.id,
			email: gqlNode.email,
			severityList: gqlNode.severity.map(s => ({title: s, value: EnumFormatter.toEnumString(s)})),
			severityDisplay: gqlNode.severity.join(', '),
			optedIn: gqlNode.optedIn ? 'Yes' : 'No',
			organisation: this.organisationMapper.getModel(gqlNode.organisation),
		};
	}

	getMutationInput(mlForm: FormGroup): IMailingListInput {
		return {
			email: mlForm.get('email').value,
			severity: mlForm.get('severity').value.map(value => value.value),
			organisation: {id: mlForm.get('organisation').value.id}
		};
	}
}
