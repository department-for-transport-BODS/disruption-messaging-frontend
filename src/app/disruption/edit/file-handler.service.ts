import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { IFormSubmittedState } from '../../shared/forms/FormStateEnum';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import { IEditDisruptionGraphQLMapper } from './edit-disruption.graphql.mapper';
import { IEditDisruptionViewModelMapper } from './edit-disruption.view-model.mapper';
import { filter, tap, take } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class FileHandlerService {
	file: any;
	isFileSizeError = false;
	isUnsupportedFileType = false;

	constructor(
	) {}

	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 * @param acceptedFileTypes (File types)
	 */
	prepareFilesList(files: Array<any>, acceptedImageTypes: Array<string>) {
		const fileList = [];
		fileList.push.apply(fileList, files);

		const filesLen = fileList.length;
		if (filesLen > 1) {
			fileList.splice(0, 1);
		} else if (filesLen === 1) {
			if (fileList[0].size > 4e+6) {
				this.isFileSizeError = true;
				return null;
			} else {
				this.isFileSizeError = false;
			}
			if (!acceptedImageTypes.includes(fileList[0].type)) {
				this.isUnsupportedFileType = true;
				return null;
			} else {
				this.isUnsupportedFileType = false;
			}
			return fileList[0];
		}
	}
}
