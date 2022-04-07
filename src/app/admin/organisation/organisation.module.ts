import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgListComponent } from './org-list/org-list.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { OrgEditComponent } from './org-edit/org-edit.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrgDeleteComponent } from './org-delete/org-delete.component';
import { OrganisationComponent } from './organisation.component';

@NgModule({
	declarations: [OrgListComponent, OrgEditComponent, OrgDeleteComponent, OrganisationComponent],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgxSmartModalModule.forRoot(),
		NgSelectModule
	],
	exports: [OrganisationComponent]
})
export class OrganisationModule {}
