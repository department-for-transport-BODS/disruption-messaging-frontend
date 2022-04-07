import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AsciiValidator {
	public static validate: ValidatorFn = (control: FormControl): ValidationErrors | null => {
		const text = control.value;
		const reg = /([^\x00-\x7F]).*?/;

		if (!text) {
			return null;
		}

		if (reg.test(text)) {
			const match = reg.exec(text)
			return { nonAscii: match[0] };
		}
		return null;
	}
}
