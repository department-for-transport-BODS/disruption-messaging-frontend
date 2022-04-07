import { FormControl } from '@angular/forms';

export class DeletedDisruptionValidator {
	public static validate() {
		return (control: FormControl) => {
			const disruptions = control.value;
			if (!disruptions) {
				return;
			}
			for (let disruption of disruptions) {
				if (disruption.deleted) {
					return {deleted: true};
				}
			}
			return;
		};
	}
}
