import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors, ValidatorFn } from '@angular/forms';
import Filter from 'bad-words';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, map } from 'rxjs/operators';

// List of words which may appear in street names
const BAD_WORDS_WHITELIST = [
	'ass', 'butthole', 'cock', 'cocks', 'cum', 'dick', 'fag',
	'fags', 'knob', 'shit', 'shitter', 'slag', 'tit', 'slut',
	'fanny', 'hell', 'screw', 'twat', 'butt', 'dyke', 'dike',
	'butt', 'penis'
];

const profanityChecker = new Filter();
profanityChecker.removeWords(...BAD_WORDS_WHITELIST);

/**
 * Do ensure that the sync validator is attached to the control with some debounce, otherwise
 * large pieces of text will slow validation down.
 */
export const ProfanityValidatorFn =
	(): ValidatorFn => {
		return (control: AbstractControl): { [key: string]: any } | null => {
			if (profanityChecker.isProfane(control.value)) {
				return {profanity: true};
			}
			return null;
		};
	};


export const ProfanityAsyncValidatorFn =
	(time: number = 300) => {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return control.valueChanges
				.pipe(
					debounceTime(time),
					distinctUntilChanged(),
					map(value => {
						if (value) {
							if (profanityChecker.isProfane(value)) {
								return {profanity: true};
							}
						}
						return null;
					}),
					first()); // important to make observable finite
		};
	};

/**
 * Use this directive to add profanity checks to your text fields.
 *
 * Important Note: If you are using a component that's a BaseControlValueAccessor with its own NG_VALIDATOR, the async validation
 * results will not be updated for the control this validation is for a child control. Store the abstract control for the component
 * and use that to set errors manually. See overview.component.ts for such usage.
 */
@Directive({
	selector: '[dmProfanityValidator]',
	providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ProfanityAsyncValidator, multi: true}]
})
export class ProfanityAsyncValidator implements AsyncValidator {
	validate(control: AbstractControl): Observable<ValidationErrors | null> {
		return ProfanityAsyncValidatorFn()(control);
	}
}
