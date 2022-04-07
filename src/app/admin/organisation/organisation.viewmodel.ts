import {IAdminAreaType} from 'src/generated/graphql';

export interface OrganisationViewModel {
	// This class represents a single (readonly) row in the organisation list
	id: string;
	name: string;
	url: string;
	adminAreas: IAdminAreaType[];
	adminAreasString: string;  // Comma separated list of admin areas.
}
