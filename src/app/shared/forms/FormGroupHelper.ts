import { FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class FormGroupHelper {
	public static getAllErrors(form: FormGroup | FormArray): { [key: string]: any } | null {
		let hasError = false;
		const result = Object.keys(form.controls).reduce(
			(acc, key) => {
				const control = form.get(key);
				const errors =
					control instanceof FormGroup || control instanceof FormArray
						? this.getAllErrors(control)
						: control.errors;
				if (errors) {
					acc[key] = errors;
					hasError = true;
				}
				return acc;
			},
			{} as { [key: string]: any }
		);
		// Add any form level cross-validation errors.
		if (form.errors) {
			result.errors = form.errors;
			hasError = true;
		}
		return hasError ? result : null;
	}

	public static whenIthinkAboutYou(form: FormGroup | FormArray): void {
		Object.keys(form.controls).forEach(key => {
			form.controls[key].markAsTouched();
		});
	}

	public static likeAVirgin(form: FormGroup | FormArray): void {
		Object.keys(form.controls).forEach(key => {
			form.controls[key].markAsUntouched();
			form.controls[key].markAsPristine();
		});
	}
}
