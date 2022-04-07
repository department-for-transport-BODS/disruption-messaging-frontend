import { ImpactViewModel } from './impact.viewmodel';
import { FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ImpactViewModelMapper {
	public mapFromImpactForm(form: FormArray): ImpactViewModel[] {
		return form.value.map(f => ({
			id: f.id,
			advice: f.advice,
			severity: f.severity,
			mode: f.mode,
			type: f.type,
			delay: f.delay,
			direction: f.direction,
			operators: f.operators.map(op => op.name),
			lines: f.lines.map(line => line.featureName),
			stopNames: f.stops.map(stops => stops.featureName)
		}));
	}

	private stopNames(stops: any[]): string[] {
		return stops.map(st => st.commonName);
	}
}
