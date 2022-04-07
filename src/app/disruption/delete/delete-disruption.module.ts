import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { DeleteDisruptionComponent } from './delete-disruption.component';
import { DeleteDisruptionService } from './delete-disruption.service';


@NgModule({
	declarations: [
		DeleteDisruptionComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule,
		NgxSmartModalModule
	],
	exports: [DeleteDisruptionComponent],
	providers: [DeleteDisruptionService]
})
export class DeleteDisruptionModule {}
