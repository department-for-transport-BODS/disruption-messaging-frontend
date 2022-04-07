import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ITransModelLineType } from 'src/generated/graphql';
import { LinesListService } from './lines-list.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import { sortBy } from 'lodash';

@Component({
	selector: 'dm-autocomplete-lines',
	templateUrl: './autocomplete-lines.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => AutocompleteLinesComponent),
			multi: true
		}
	]
})
export class AutocompleteLinesComponent extends BaseControlValueAccessor<string> implements OnInit {
	// Autocomplete control:   https://www.npmjs.com/package/@ng-select/ng-select

	selectedItems = null;

	allLines$: Observable<ITransModelLineType[]>;
	loading = false;

	constructor(private linesListService: LinesListService) {
		super();
	}

	ngOnInit() {
		this.loading = true;
		this.allLines$ = this.linesListService.listLines().pipe(
			tap((result) => result && (this.loading = false))
		);
	}

	public writeValue(obj: string): void {
		// have to manually clear selection, using ngModel binding, yeuch.
		if (obj === null) {
			this.selectedItems = null;
		}
		this.value = obj;
	}

	registerOnChange(fn) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onValueChange(event) {
		if (event && event.length) {
			const sorted = sortBy(event, [(o) => parseInt(o.name, 10)]);
			this.onChange(sorted.map(line => line.entityId)) 
		} else {
			this.onChange(null);
		}
	}
}
