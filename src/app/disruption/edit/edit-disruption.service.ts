import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
	IDisruptionNode,
	ICreateDisruptionGQL,
	IUpdateDisruptionGQL,
	ISubmitDisruptionGQL,
	IDisruptionByIdForEditGQL
} from 'src/generated/graphql';
import { IFormSubmittedState } from '../../shared/forms/FormStateEnum';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import { IEditDisruptionGraphQLMapper } from './edit-disruption.graphql.mapper';
import { IEditDisruptionViewModelMapper } from './edit-disruption.view-model.mapper';
import { filter, tap, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class EditDisruptionService {
	constructor(
		private createDisruption: ICreateDisruptionGQL,
		private updateDisruption: IUpdateDisruptionGQL,
		private submitDisruption: ISubmitDisruptionGQL,
		private disruptionForEdit: IDisruptionByIdForEditGQL,
		private viewModelMapper: IEditDisruptionViewModelMapper,
		private graphQLMapper: IEditDisruptionGraphQLMapper,
	) {}

	id: string;
	subscription: Subscription;

	private currentDisruptionSubject = new Subject<IEditDisruptionViewModel>();
	get currentDisruption$() {
		return this.currentDisruptionSubject.asObservable();
	}

	private hasBeenSubmittedSubject = new Subject<IFormSubmittedState>();
	get formSubmitStatus$() {
		return this.hasBeenSubmittedSubject.asObservable();
	}

	private loadingSubject = new BehaviorSubject<any>(false);
	get loading$() {
		return this.loadingSubject.asObservable();
	}

	private errorSubject = new BehaviorSubject<any>(null);
	get errors$() {
		return this.errorSubject.asObservable();
	}

	set errors$(val: any) {
		this.errorSubject.next(val);
	}

	private disruptionDescription: string;

	get description() {
		return this.disruptionDescription;
	}

	set description(val: any) {
		this.disruptionDescription = val;
	}

	public clearCurrentDisruption() {
		this.id = null;
		this.currentDisruptionSubject.next(null);
	}

	public setSubmittedStatus(status: IFormSubmittedState) {
		this.hasBeenSubmittedSubject.next(status);
	}

	public saveDisruption(disruptionForm: FormGroup, submit: boolean = false, isTemplate: boolean = false): void {
		this.errors$ = null;

		const id = disruptionForm.get('id').value;
		const submitComment = disruptionForm.get('submitComment').value;
		const params = this.graphQLMapper.toDisruptionInput(disruptionForm);
		params.isTemplate = isTemplate;
		this.loadingSubject.next(true);
		if (!id) {
			this.createDisruption
				.mutate({ params })
				.pipe(tap((res) => res && !submit && this.loadingSubject.next(false)))
				.subscribe(
					res => {
						this.responseHandler(res.data.createDisruption, submit, submitComment);
					},
					error => {
						this.errorSubject.next(error);
					}
			);
		} else {
			this.updateDisruption
				.mutate({ id, params })
				.pipe(tap((res) => res && !submit && this.loadingSubject.next(false)))
				.subscribe(
					res => {
						this.responseHandler(res.data.updateDisruption, submit, submitComment);
					},
					error => {
						this.errorSubject.next(error);
					}
			);
		}
	}

	public submitForPublication(disruptionForm: FormGroup): void {
		this.saveDisruption(disruptionForm, true);
	}

	private responseHandler(result: any, submit: boolean, submitComment: string = '') {
		if (result.success && !result.errors) {
			const viewModel = this.viewModelMapper.toEditDisruptionViewModel(result.data);

			this.currentDisruptionSubject.next(viewModel);
			this.hasBeenSubmittedSubject.next(IFormSubmittedState.Saved);

			if (submit) {
				this.submit(viewModel.id, submitComment);
			}
		} else {
			this.errorSubject.next(result.errors);
		}
	}

	private submit(id: string, comment: string) {
		this.submitDisruption
			.mutate({ id, comment })
			.pipe(tap((res) => res && this.loadingSubject.next(false)))
			.subscribe(res => {
				if (res.data.submitDisruption.success) {
					this.hasBeenSubmittedSubject.next(IFormSubmittedState.Submitted);
				} else {
					this.errorSubject.next(res.data.submitDisruption.errors);
				}
			});
	}

	public setCurrentDisruption(id: number, duplicate: boolean = false) {
		const encodedId = this.viewModelMapper.encodeDisruptionId(id);
		this.id = encodedId;
		if (this.subscription) { 
			this.subscription.unsubscribe();
		}
		this.subscription = this.disruptionForEdit
			.watch({ id: encodedId })
			.valueChanges
			.pipe(filter((result) => Boolean(result.data)))
			.pipe(tap((res) => this.loadingSubject.next(res.loading)))
			.subscribe(
				result => {
					const disruption = result.data.disruption as IDisruptionNode;
					const vm = this.viewModelMapper.toEditDisruptionViewModel(disruption);
					if (duplicate) {
						this.clearIdsAndMessagePublishStatusForDuplicateDisruption(vm);
					}  else if (this.id && this.id !== vm.id) {
						// Current disruption has been updated, discard this response.
						console.log( this.id, vm.id );
						console.warn('Current disruption modified, discarding response');
						return;
					}
					this.currentDisruptionSubject.next(vm);
				},
				error => {
					console.log(error); // TODO log this real error
					this.errorSubject.next(`Disruption ${id} could not be found`);
				}
		);
	}

	private clearIdsAndMessagePublishStatusForDuplicateDisruption(vm: IEditDisruptionViewModel) {
		vm.id = null;
		vm.decodedId = null;
		vm.isTemplate = false;
		vm.validityPeriods.map(vp => {
			vp.id = '';
		});
		vm.impacts.map(i => {
			i.id = '';
		});
		vm.socialMessages.map(sm => {
			sm.id = '';
			sm.published = false;
			sm.lastPublishedError = '';
			sm.publishedOn = null;
		});
	}
}
