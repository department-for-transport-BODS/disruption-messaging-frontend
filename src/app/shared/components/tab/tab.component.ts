import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'dm-tab',
	styleUrls: ['tab.component.scss'],
	templateUrl: 'tab.component.html'
})
export class TabComponent implements OnInit {
	id: string;
	@Input() title: string;
	@Input() active = false;

	ngOnInit(): void {
		this.id = this.title;
	}
}
