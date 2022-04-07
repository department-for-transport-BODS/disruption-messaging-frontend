import { ControlValueAccessor, AbstractControl, ValidationErrors, FormGroup, FormArray } from '@angular/forms';

// https://www.leonelngande.com/using-a-base-controlvalueaccessor-class-to-quickly-bootstrap-angular-custom-form-controls/

export class BaseControlValueAccessor<T> implements ControlValueAccessor {
	public disabled = false;
	public value: T;

	/**
	 * Call when value has changed programatically
	 */
	public onChange(newVal: T) {}
	public onTouched(_?: any) {}

	/**
	 * Model -> View changes
	 */
	public writeValue(obj: T): void {
		this.value = obj;
	}
	public registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	public registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	public setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}
}
