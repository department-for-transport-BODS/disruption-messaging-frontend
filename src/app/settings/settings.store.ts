import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EnumTuple, EnumFormatter } from '../shared/formatters/enum.formatter';
import { SettingsService } from './settings.service';
import { IEnumOverridesObject } from 'src/generated/graphql';

@Injectable({
	providedIn: 'root'
})
export class SettingsStore {
	constructor(private service: SettingsService) {}

	private reasonsSubject = new BehaviorSubject<EnumTuple[]>(null);
	private severitySubject = new BehaviorSubject<EnumTuple[]>(null);
	private directionSubject = new BehaviorSubject<EnumTuple[]>(null);

	populateReferenceData() {
		this.service.enumList$().subscribe(enumList => {
			this.reasonsSubject.next(this.toEnumTuple('Reason', enumList));
			this.severitySubject.next(this.toEnumTuple('Severity', enumList));
			this.directionSubject.next(this.toEnumTuple('Direction', enumList));
		});
	}

	private toEnumTuple(identifier: string, enumList: IEnumOverridesObject[]) {
		if (!enumList) {
			return [];
		}
		const e = enumList.find(f => f.type === identifier);
		if (e) {
			return this.constructEnumTuple(e.values);
		}
		return [];
	}

	private constructEnumTuple(enumValues: string[]): EnumTuple[] {
		return enumValues.map(key => ({
			value: key,
			title: EnumFormatter.toPrettyString(key)
		}));
	}

	reasonsList$() {
		return this.reasonsSubject.asObservable();
	}

	severityList$() {
		return this.severitySubject.asObservable();
	}

	directionList$() {
		return this.directionSubject.asObservable();
	}
}
