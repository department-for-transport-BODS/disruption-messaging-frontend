import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsListComponent } from './reviews-list.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
		ReviewsListComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		RouterModule
	]
})
export class ReviewsListModule {}
