import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
	ControlValueAccessor,
	Validator,
	FormGroup,
	AbstractControl,
	ValidationErrors,
	NG_VALUE_ACCESSOR,
	NG_VALIDATORS,
	FormBuilder,
	FormArray
} from '@angular/forms';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import { ImpactComponentForm } from '../impact/impact-component-form';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { Subscription } from 'rxjs';
import { EditDisruptionService } from '../edit-disruption.service';
import { IEditDisruptionViewModel } from '../edit-disruption.view.model';
import { ImpactViewModel } from 'src/app/shared/disruption-mapper/impact.viewmodel';
import { ImpactViewModelMapper } from 'src/app/shared/disruption-mapper/impact.viewmodel.mapper';
import { ImpactMapService } from '../impact-map/impact-map.service';

@Component({
	selector: 'dm-impacts-list',
	templateUrl: './impacts-list.component.html',
	styleUrls: ['./impacts-list.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ImpactsListComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => ImpactsListComponent),
			multi: true
		}
	]
})
export class ImpactsListComponent extends BaseControlValueAccessor<ImpactComponentForm[]>
	implements OnInit, ControlValueAccessor, Validator, OnDestroy {
	private currentDisruptionSubscription: Subscription;
	private impactChangingSubscription: Subscription;

	private currentImpactIndex = -1;

	public impactsGroup: FormGroup;

	get impactsArr(): FormArray {
		return this.impactsGroup.get('impacts') as FormArray;
	}

	get impactReadOnly(): ImpactViewModel[] {
		return this.readOnlyMapper.mapFromImpactForm(this.impactsArr);
	}

	get currentImpactHasData(): any {
		return this.impactsGroup.get('currentImpact').value !== null;
	}

	constructor(
		private formBuilder: FormBuilder,
		private ngxSmartModalService: NgxSmartModalService,
		private editDisruptionService: EditDisruptionService,
		private readOnlyMapper: ImpactViewModelMapper,
		private impactMapService: ImpactMapService
	) {
		super();
	}

	ngOnInit(): void {
		this.initNewForm();

		this.impactChangingSubscription = this.impactsGroup.valueChanges.subscribe(val => {
			this.value = val.impacts;
			this.onChange(val);
		});

		this.currentDisruptionSubscription = this.editDisruptionService.currentDisruption$.subscribe(disruption => {
			if (disruption) {
				this.patchValues(disruption);
			} else {
				this.impactsArr.clear();
				this.impactsGroup.reset();
				this.unloadCurrentImpact();
			}
		});
	}

	ngOnDestroy() {
		if (this.currentDisruptionSubscription) {
			this.currentDisruptionSubscription.unsubscribe();
		}
		if (this.impactChangingSubscription) {
			this.impactChangingSubscription.unsubscribe();
		}
	}

	private initNewForm() {
		this.impactsGroup = this.formBuilder.group({
			impacts: this.formBuilder.array([]),
			currentImpact: null
		});
	}

	private patchValues(viewModel: IEditDisruptionViewModel) {
		if (viewModel && viewModel.impacts) {
			this.impactsArr.clear();
			viewModel.impacts.map(impact => {
				this.impactsArr.push(this.formBuilder.control(impact));
			});
		}
	}

	openModal(idx: number): void {
		this.currentImpactIndex = idx;
		this.impactsGroup
			.get('currentImpact')
			.patchValue(ImpactComponentForm.patchedValues(this.impactsArr.value[this.currentImpactIndex], false));
		this.ngxSmartModalService.get('impact-modal').open();
	}

	newImpact() {
		this.currentImpactIndex = 999; // beware magic number
		this.impactsGroup.get('currentImpact').patchValue(new ImpactComponentForm());
		this.ngxSmartModalService.get('impact-modal').open();
	}

	unloadCurrentImpact(): void {
		this.currentImpactIndex = -1;
	}

	closeModal(): void {
		this.ngxSmartModalService.get('impact-modal').close();
	}

	saveAndCloseModal(): void {
		if (this.currentImpactIndex === 999) {
			// Extend array with new impact
			this.writeValue(this.value.concat(this.impactsGroup.get('currentImpact').value));
		} else {
			this.impactsArr.at(this.currentImpactIndex).patchValue(this.impactsGroup.get('currentImpact').value);
		}
		this.closeModal();
		this.impactMapService.resetMapData();
	}

	removeImpact(idx: number): void {
		this.impactsArr.removeAt(idx);
	}

	duplicate(idx: number): void {
		this.currentImpactIndex = 999; // beware magic number

		const values = this.impactsArr.value[idx];
		this.impactsGroup.get('currentImpact').patchValue(ImpactComponentForm.patchedValues(values, true));
		this.ngxSmartModalService.get('impact-modal').open();
	}

	writeValue(impacts: ImpactComponentForm[]) {
		super.writeValue(impacts);

		while (this.impactsArr.length > 0) {
			this.impactsArr.removeAt(0);
		}
		impacts.forEach(impact => this.impactsArr.push(this.formBuilder.control(impact)));
	}

	validate(c: AbstractControl): ValidationErrors | null {
		if (this.impactsArr.length === 0) {
			return { errors: { required: true } };
		}
		if (this.impactsArr.length > 0) {
			return null;
		}

		return this.impactsGroup.valid ? null : { errors: FormGroupHelper.getAllErrors(this.impactsGroup) };
	}
}
