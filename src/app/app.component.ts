import { Component, OnInit } from '@angular/core';
import { UserStoreService } from './user/user.store.service';
import { Router } from '@angular/router';
import { IUserType } from 'src/generated/graphql';
import { SettingsStore } from './settings/settings.store';
import { TransModelStore } from './shared/components/transport-data/transmodel.store';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	user: IUserType = null;

	constructor(
		private userStore: UserStoreService,
		private router: Router,
		private settingsStore: SettingsStore,
		private transModelStore: TransModelStore) {}

	ngOnInit(): void {
		this.userStore.user$.subscribe(user => {
			this.user = user;
			if (user !== null && this.router.url === '/login') {
				this.router.navigate(['dashboard']);
			}
			if (this.user !== null) {
				this.settingsStore.populateReferenceData();
				this.transModelStore.getAdminAreas();
			}
		});
	}

	authenticated(): boolean {
		return this.user !== null;
	}
}
