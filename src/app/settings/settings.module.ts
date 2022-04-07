import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SettingsComponent } from './settings.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

@NgModule({
	declarations: [SettingsComponent],
	imports: [FormsModule, CommonModule, DragDropModule, SharedModule, OwlDateTimeModule,
		OwlMomentDateTimeModule, FormsModule],
	providers: [],
	exports: [SettingsComponent]
})
export class SettingsModule {}
