import { DisruptionMapperBase } from './disruptions.mapper';
import {IDisruptionImpactNodeEdge, IValidityPeriodType} from 'src/generated/graphql';

export class DisruptionsMapperTestAccess extends DisruptionMapperBase {

	// This exposes protected methods on the DisruptionsMapperBase class to make them testable.
	// This class should now be used directly by the application.

	decodeBase64Id(encodedId: string): string {
		return super.decodeBase64Id(encodedId);
	}

	getStopsSummary(impactNodes: IDisruptionImpactNodeEdge[]): string {
		return super.getStopsSummary(impactNodes);
	}

	getServicesAffected(impactNodes: IDisruptionImpactNodeEdge[]): string {
		return super.getServicesAffected(impactNodes);
	}

	getDuration(validityPeriods: IValidityPeriodType[], isOpenEnded: boolean): string {
		return super.getDuration(validityPeriods, isOpenEnded);
	}
}
