import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../environments/environment';

import { ButtonComponent } from './components/button/button.component';
import {
	CardComponent,
	CardBodyComponent,
	CardFooterComponent,
	CardHeaderComponent
} from './components/card/card.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { DisruptionsMapComponent, MapPopupComponent } from './components/map/disruptions-map.component';
import { PopoverComponent } from './components/popover/popover.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabsService } from './components/tabs/tabs.service';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { BannerComponent } from './components/banner/banner.component';
import { ButtonGroupComponent } from './components/button-group/button-group.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryService } from './services/query.service';
import { CommentComponent } from './components/comment/comment.component';
import { ValidityPeriodComponent } from './components/validity-period/validity-period.component';
import { LiveIndicatorComponent } from './components/live-indicator/live-indicator.component';
import { ImpactListItemComponent } from './components/impact-list-item/impact-list-item.component';
import { ImpactViewModelMapper } from './disruption-mapper/impact.viewmodel.mapper';
import { VersionComponent } from './components/version/version.component';
import { ProfanityAsyncValidator } from './validators/profanity.validator';
import { FooterComponent } from './components/footer/footer.component';
import { AutocompleteOperatorsComponent } from './components/autocomplete-operators/autocomplete-operators.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TableComponent } from './components/table/table.component';
import { TableButtonsParentComponent } from './components/table/table-buttons.parent.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import {PopoverListComponent} from './components/popover/popover-list.component';
import {DragAndDropComponent} from './drag-and-drop/drag-and-drop.component';


@NgModule({
	declarations: [
		PopoverComponent,
		PopoverListComponent,
		DragAndDropComponent,
		IconButtonComponent,
		DisruptionsMapComponent,
		MapPopupComponent,
		ButtonComponent,
		CardComponent,
		CardHeaderComponent,
		CardBodyComponent,
		CardFooterComponent,
		TabComponent,
		TabsComponent,
		PageHeaderComponent,
		BannerComponent,
		ButtonGroupComponent,
		CommentComponent,
		ValidityPeriodComponent,
		LiveIndicatorComponent,
		ImpactListItemComponent,
		AutocompleteOperatorsComponent,
		VersionComponent,
		ProfanityAsyncValidator,
		FooterComponent,
		TableComponent,
		TableButtonsParentComponent,
		SpinnerComponent
	],
	imports: [
		CommonModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		AngularSvgIconModule,
		HttpClientModule,
		NgxMapboxGLModule.withConfig({
			accessToken: environment.mapbox.accessToken,
			geocoderAccessToken: environment.mapbox.accessToken
		}),
		NgxSpinnerModule,
		AgGridModule.withComponents([TableButtonsParentComponent])
	],
	exports: [
		PopoverComponent,
		IconButtonComponent,
		DisruptionsMapComponent,
		MapPopupComponent,
		AngularSvgIconModule,
		ButtonComponent,
		CardComponent,
		CardHeaderComponent,
		CardBodyComponent,
		CardFooterComponent,
		TabComponent,
		TabsComponent,
		PageHeaderComponent,
		BannerComponent,
		ButtonGroupComponent,
		CommentComponent,
		ValidityPeriodComponent,
		LiveIndicatorComponent,
		ImpactListItemComponent,
		AutocompleteOperatorsComponent,
		VersionComponent,
		FooterComponent,
		ProfanityAsyncValidator,
		TableComponent,
		SpinnerComponent,
		PopoverListComponent,
		DragAndDropComponent
	],
	providers: [TabsService, QueryService, ImpactViewModelMapper]
})
export class SharedModule {}
