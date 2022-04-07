import { FormControl } from '@angular/forms';

// Same as Angular's standard Validators.email except that the domain with a . is required. Standard regex allows foo@bar but Django
// backend doesn't allow it so make this stricter by replacing the last '*' in the regex with a '+' - and also that the domain should
// be at least 2 characters long.
const EMAIL_REGEXP =
	/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]){1,63}?)+$/;

export class EmailValidator {
	public static validate() {
		return (control: FormControl) => {
			if (control.value == null || control.value.length === 0) {
				return null;
			}
			return EMAIL_REGEXP.test(control.value) ? null : {email: true};
		};
	}
}
