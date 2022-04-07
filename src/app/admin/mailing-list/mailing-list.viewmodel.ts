import { OrganisationViewModel } from '../organisation/organisation.viewmodel';
import { EnumTuple } from '../../shared/formatters/enum.formatter';

export interface MailingListViewmodel {
	// This class represents a single (readonly) row in the mailing list entry
	id: string;
	email: string;
	severityList: EnumTuple[];
	severityDisplay: string;
	optedIn: string;
	organisation: OrganisationViewModel;
}
