import { NgModule } from '@angular/core';
import { SupportComponent } from './support.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [SupportComponent],
	imports: [SharedModule],
	exports: [SupportComponent]
})
export class SupportModule {}
