import { Validators, AbstractControl, ValidationErrors, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { DisruptionAutocompleteModel } from './autocomplete-disruptions/disruption-autocomplete.model';
import { ProfanityValidatorFn } from 'src/app/shared/validators/profanity.validator';
import { AsciiValidator } from 'src/app/shared/validators/ascii.validator';
import { LeadingSpaceValidator } from 'src/app/shared/validators/leadingspace.validator';
import { LinkValidator } from 'src/app/shared/validators/link.validator';
import { DeletedDisruptionValidator } from './disruption.validator';

export class OverviewComponentForm {
	summary: (string | ((control: AbstractControl) => ValidationErrors)[])[];
	description: (string | ((control: AbstractControl) => ValidationErrors)[])[];
	link: (string | ((control: AbstractControl) => ValidationErrors))[];
	disruptionType: (string | ((control: AbstractControl) => ValidationErrors))[];
	reason: (string | ((control: AbstractControl) => ValidationErrors))[];
	related: (DisruptionAutocompleteModel[] | ((control: AbstractControl) => ValidationErrors))[];
	publishingStart: ({ startDate: any; endDate: any } | ((control: AbstractControl) => ValidationErrors))[];
	publishingEnd: ({ startDate: any; endDate: any } | ((control: AbstractControl) => ValidationErrors))[];
	validityPeriods: FormArray;
	isOpenEnded: (boolean | ((control: AbstractControl) => ValidationErrors)[])[];

	constructor(private formBuilder: FormBuilder) {
		this.summary = ['', [Validators.required, , LeadingSpaceValidator.validate, AsciiValidator.validate, Validators.maxLength(160), ProfanityValidatorFn()]];
		this.description = ['', [Validators.required, Validators.maxLength(1000), ProfanityValidatorFn(), AsciiValidator.validate]];
		this.link = ['', LinkValidator.validate()];
		this.disruptionType = ['', Validators.required];
		this.reason = ['', Validators.required];
		this.related = [[], DeletedDisruptionValidator.validate()];
		this.publishingStart = [null, Validators.required];
		this.publishingEnd = [null, Validators.required];
		this.validityPeriods = this.formBuilder.array([]);
		this.isOpenEnded = [false];
	}
}
