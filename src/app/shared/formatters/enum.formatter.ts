import { Injectable } from '@angular/core';

export interface EnumTuple {
	value: any;
	title: string;
}

@Injectable({
	providedIn: 'root'
})
export class EnumFormatter {
	public static toHumanisedDictionary(definition: any): EnumTuple[] {
		// inserts spaces into CamelCase enum titles
		return Object.keys(definition).map(key => ({ value: definition[key], title: key.replace(/([A-Z])/g, ' $1') }));
	}

	public static prettifyNames(definition: string[]): string[] {
		// inserts spaces into CamelCase enum titles
		return definition.map(val => val.replace(/([A-Z])/g, ' $1').trimLeft());
	}

	public static prettifyKeys(definition: any): EnumTuple[] {
		// inserts spaces into CamelCase enum titles
		return Object.keys(definition).map(key => ({ value: key, title: key.replace(/([A-Z])/g, ' $1') }));
	}

	public static toEnumString(val: string): string {
		return val && val.replace(/\s/g, '');
	}

	public static toPrettyString(val: string): string {
		return val && `${val.charAt(0).toUpperCase()}${val.substr(1).replace(/([A-Z])/g, ' $1')}`.trimLeft();
	}
}
