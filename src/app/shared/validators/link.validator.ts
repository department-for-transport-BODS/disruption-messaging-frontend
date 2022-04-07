import { FormControl } from '@angular/forms';

export class LinkValidator {
	public static validate() {
		return (control: FormControl) => {
			const link = control.value;
			const reg = /^(?:(http)(s)?:\/\/)(([\w]|[_&%#=~\(\)\?\+\-\|\/])+?[.{1}])+?([\w]|[_&%#=~\(\)\?\+\-\|\/])+?([/{1}]([\w]|[;:_&%#=~\(\)\?\+\-\|\/])*?)*?$/i;

			if (!link) {
				return;
			}

			if (!reg.test(link) || link.indexOf(' ') !== -1) {
				return { pattern: true };
			}
		};
	}
}
