import {Injectable} from '@angular/core';
import {IOrganisationInput, IOrganisationType} from 'src/generated/graphql';
import {OrganisationViewModel} from './organisation.viewmodel';
import {FormGroup} from '@angular/forms';
import { ViewModelMapper } from '../../shared/types/viewmodel-mapper';
import { GraphQLMapper } from '../../shared/types/graphql-mapper';

@Injectable({
	providedIn: 'root'
})

export class OrganisationMapper
		implements ViewModelMapper<IOrganisationType, OrganisationViewModel>,
			GraphQLMapper<IOrganisationInput> {
	getModel(gqlNode: IOrganisationType): OrganisationViewModel {
		return {
			id: gqlNode.id,
			name : gqlNode.name,
			url: gqlNode.url,
			adminAreas: gqlNode.adminAreas,
			adminAreasString: gqlNode.adminAreas && gqlNode.adminAreas.map((area) => area.name).join(', ')
		};
	}

	getMutationInput(organisationForm: FormGroup): IOrganisationInput {
		const adminAreas = organisationForm.get('adminAreas').value || [];
		return {
			name: organisationForm.get('name').value,
			url: organisationForm.get('url').value,
			adminAreas: adminAreas.map(
				(area) => ({areaCode: area.areaCode}))
		};
	}
}
