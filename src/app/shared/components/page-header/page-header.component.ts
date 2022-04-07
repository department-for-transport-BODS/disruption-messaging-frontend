import { Component, Input, OnInit, AfterContentChecked } from '@angular/core';

@Component({
	selector: 'dm-page-header',
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit, AfterContentChecked {
	@Input() title = '';
	localTitle: string;
	constructor() {}

	ngOnInit() {}

	ngAfterContentChecked(): void {
		this.localTitle = this.title;
	}
}
