import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'dm-main-menu',
	templateUrl: './main-menu.component.html',
	styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
	constructor(private router: Router) {}

	urlContainsDisruptions = false;

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.urlContainsDisruptions = event.url.includes('disruption');
			}
		});
	}

	get disruptionsActive(): boolean {
		return this.urlContainsDisruptions;
	}
}
