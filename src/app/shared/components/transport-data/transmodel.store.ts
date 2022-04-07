import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITransModelAdminAreaListType } from 'src/generated/graphql';
import { TransModelService } from './transmodel.service';

@Injectable({
	providedIn: 'root'
})
export class TransModelStore {
	constructor(private service: TransModelService) {}

	private adminAreasSubject = new BehaviorSubject<ITransModelAdminAreaListType[]>(null);

	getAdminAreas() {
		this.service.adminAreas$().subscribe(adminAreas => {
			this.adminAreasSubject.next(adminAreas);
		});
	}

	adminAreas$() {
		return this.adminAreasSubject.asObservable();
	}
}
