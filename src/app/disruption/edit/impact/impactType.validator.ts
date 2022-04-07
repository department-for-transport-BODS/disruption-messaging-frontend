import { FormGroup } from '@angular/forms';
import { IImpactType } from 'src/app/shared/impact.type.enum';

export class ImpactTypeValidator {
	public static conditionalFields() {
		return (group: FormGroup): { [key: string]: any } => {
			const type = group.controls.type.value;
			const operators = group.controls.operators.value;
			const lines = group.controls.lines.value;
			const stops = group.controls.stops.value;
			const errors: any = {};

			if ((type === IImpactType.Operator || type === IImpactType.Service) && (!operators || operators.length === 0)) {
				errors.operators = true;
			}
			if (type === IImpactType.Service && (!lines || lines.length === 0)) {
				errors.lines = true;
			}
			if (type === IImpactType.Stops && (!stops || stops.length === 0)) {
				errors.stops = true;
			}
			return errors;
		};
	}
}
