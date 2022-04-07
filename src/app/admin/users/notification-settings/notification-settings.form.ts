import { FormBuilder, FormArray } from '@angular/forms';

export class NotificationSettingsForm {
	settings: FormArray;

	constructor(private formBuilder: FormBuilder) {
		this.settings = this.formBuilder.array([]);
	}
}
