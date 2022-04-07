import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class LeadingSpaceValidator {
	public static validate: ValidatorFn = (control: FormControl): ValidationErrors | null => {
        const value = control.value;
		return value && value[0] === ' ' ? { leadingSpace: true } : null;
	}
}
