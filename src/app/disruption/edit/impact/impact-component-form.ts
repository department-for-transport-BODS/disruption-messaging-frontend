import { IDisruptionImpactMode, IDisruptionImpactSeverity } from 'src/generated/enum-overrides';
import { Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ProfanityValidatorFn } from '../../../shared/validators/profanity.validator';
import { AsciiValidator } from 'src/app/shared/validators/ascii.validator';

export class ImpactComponentForm {
	id: string;
	mode: (IDisruptionImpactMode | ((control: AbstractControl) => ValidationErrors))[];
	advice: (string | ((control: AbstractControl) => ValidationErrors)[])[];
	journeyPlanners: any;
	delay: any;
	severity: (IDisruptionImpactSeverity | ((control: AbstractControl) => ValidationErrors))[];
	type: any;
	operators: any;
	lines: any;
	stops: any;
	direction?: any;

	constructor() {
		this.id = '';
		this.mode = [null, Validators.required];
		this.advice = ['', [Validators.required, , AsciiValidator.validate, Validators.maxLength(1000), ProfanityValidatorFn()]];
		this.journeyPlanners = [null, Validators.required];
		this.delay = [null, [Validators.min(0), Validators.max(32767)]];
		this.severity = [null, Validators.required];
		this.type = [null, Validators.required];
		this.operators = [[]];
		this.lines = [[]];
		this.stops = [[]];
		this.direction = [];
	}

	public static patchedValues(obj: any, isNew: boolean = false): ImpactComponentForm {
		const form = new ImpactComponentForm(); // constructor recreates validators
		form.mode[0] = obj.mode;
		form.advice[0] = obj.advice;
		form.journeyPlanners[0] = obj.journeyPlanners;
		form.delay[0] = obj.delay;
		form.severity[0] = obj.severity;
		form.type[0] = obj.type;
		form.direction[0] = obj.direction;

		if (!isNew) {
			form.id = obj.id;
		}
		form.operators[0] = obj.operators;
		form.lines[0] = obj.lines;
		form.stops[0] = obj.stops;
		return form;
	}
}
