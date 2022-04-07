import { Injectable } from '@angular/core';
import {
	ICreateMailingListEntryGQL,
	IDeleteMailingListEntryGQL,
	IUpdateMailingListEntryGQL,
	IMailingListGQL,
	IMailingListInput,
	IMailingListType,
} from '../../../generated/graphql';
import { MailingListViewmodel } from './mailing-list.viewmodel';
import { MailingListMapper } from './mailing-list.mapper';
import { ApiService } from '../../shared/services/api.service';
import { FormGroup } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Injectable({
	providedIn: 'root'
})
export class MailingListService
		extends ApiService<IMailingListType, MailingListViewmodel, IMailingListInput> {

	constructor(
		private listGQL: IMailingListGQL,
		private createGQL: ICreateMailingListEntryGQL,
		private updateGQL: IUpdateMailingListEntryGQL,
		private deleteGQL: IDeleteMailingListEntryGQL,
		private modalService: NgxSmartModalService,
		private mappingService: MailingListMapper) {
			super(listGQL, createGQL, updateGQL, deleteGQL, mappingService);
	}

	save(form: FormGroup) {
		const id = form.get('id').value;
		const params = this.mappingService.getMutationInput(form);
		return id ? this.update(id, params) : this.create(params);
	}

	public addEntry() {
		this.resetSubjects();
		this.modalService.getModal('mlModal').open();
	}

	public editEntry(entry: MailingListViewmodel) {
		this.selectForEdit = entry;
		this.modalService.getModal('mlModal').open();
	}

	public deleteEntry(entry: MailingListViewmodel) {
		this.selectForDelete = entry;
		this.modalService.getModal('mlDeleteModal').open();
	}

	public modalClose() {
		this.modalService.getModal('mlModal').close();
		this.resetSubjects();
	}

	public deleteModalClose() {
		this.modalService.getModal('mlDeleteModal').close();
		this.resetSubjects();
	}
}
