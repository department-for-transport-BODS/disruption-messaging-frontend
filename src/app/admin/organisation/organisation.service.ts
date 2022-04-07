import {Injectable} from '@angular/core';
import {
	IOrganisationListGQL,
	IOrganisationType,
	IAllAdminAreasGQL,
	ICreateOrganisationGQL,
	IUpdateOrganisationGQL,
	IOrganisationInput,
	IDeleteOrganisationGQL
} from 'src/generated/graphql';
import {Observable} from 'rxjs';
import {OrganisationViewModel} from './organisation.viewmodel';
import {OrganisationMapper} from './organisation.mapper';
import {FormGroup} from '@angular/forms';
import {NgxSmartModalService} from 'ngx-smart-modal';
import { ApiService } from '../../shared/services/api.service';


@Injectable({
	providedIn: 'root'
})
export class OrganisationService
		extends ApiService<IOrganisationType, OrganisationViewModel, IOrganisationInput> {
	constructor(
		private listGQL: IOrganisationListGQL,
		private createGQL: ICreateOrganisationGQL,
		private updateGQL: IUpdateOrganisationGQL,
		private listAdminAreasGQL: IAllAdminAreasGQL,
		private deleteGQL: IDeleteOrganisationGQL,
		private mapperService: OrganisationMapper,
		private modalService: NgxSmartModalService) {
			super(listGQL, createGQL, updateGQL, deleteGQL, mapperService);
	}

	get selectedOrganisation$(): Observable<OrganisationViewModel> {
		return this.selectForEdit$();
	}

	get deletedOrganisation$(): Observable<OrganisationViewModel> {
		return this.selectForDelete$();
	}

	save(form: FormGroup) {
		const id = form.get('id').value;
		const params = this.mapperService.getMutationInput(form);
		return id ? this.update(id, params) : this.create(params);
	}

	public editOrganisation(organisation: OrganisationViewModel) {
		this.selectForEdit = organisation;
		this.modalService.getModal('orgModal').open();
	}

	public addOrganisation() {
		this.resetSubjects();
		this.modalService.getModal('orgModal').open();
	}

	public deleteOrganisation(organisation: OrganisationViewModel) {
		this.selectForDelete = organisation;
	}

	public modalClose() {
		this.modalService.getModal('orgModal').close();
		this.resetSubjects();
	}

	public deleteModalClose() {
		this.modalService.getModal('deleteConfirmModal').close();
		this.resetSubjects();
	}
}
