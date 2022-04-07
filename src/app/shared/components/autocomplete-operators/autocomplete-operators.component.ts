import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ITransModelOperatorType } from 'src/generated/graphql';
import { OperatorsListService } from './operators-list.service';
import { Observable } from 'rxjs';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import { tap } from 'rxjs/operators';

@Component({
	selector: 'dm-autocomplete-operators',
	templateUrl: './autocomplete-operators.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AutocompleteOperatorsComponent),
			multi: true
		}
	]
})
export class AutocompleteOperatorsComponent extends BaseControlValueAccessor<string> implements OnInit {
	// Autocomplete control:   https://www.npmjs.com/package/@ng-select/ng-select
	selectedItems = null;
	@Input() bindValue: string;
	loading = false;

	allOperators$: Observable<ITransModelOperatorType[]>;

	constructor(private operatorsListService: OperatorsListService) {
		super();
	}

	ngOnInit() {
		this.loading = true;
		this.allOperators$ = this.operatorsListService.listOperators()
			.pipe(tap((result) => result && (this.loading = false)));
	}

	registerOnChange(fn) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	public writeValue(obj: string): void {
		// have to manually clear selection, using ngModel binding, yeuch.
		if (obj === null) {
			this.selectedItems = null;
		}
		this.value = obj;
	}

	onValueChange(event) {
		event && event.length ? this.onChange(event.map(op => op.entityId)) : this.onChange(null);
	}
}
