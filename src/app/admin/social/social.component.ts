import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialService } from 'src/app/social/social.service';
import { ISocialAccountViewModel } from 'src/app/social/social.view.model';
import { ISocialAccountEnum } from 'src/generated/graphql';
import { skip } from 'rxjs/operators';
import { ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { ILocalStorage } from './social.localstorage.enum';
import { Location } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HootSuiteCellRenderer } from './hootsuite-profile.cell.component';

@Component({
	selector: 'dm-social',
	templateUrl: './social.component.html',
	styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit, OnDestroy {
	socialAccounts$: Observable<ISocialAccountViewModel[]>;
	callbackMessage: string;
	callbackStatus: string;
	progress: boolean;
	private timeoutId: NodeJS.Timeout;
	private id: string;

	columnDefs = [
		{headerName: 'Account Type', field: 'accountType'},
		{headerName: 'Username / Page', field: 'displayName'},
		{headerName: 'Added by', field: 'createdBy'},
		{headerName: 'Expires in', field: 'expiresIn'},
		{
			headerName: 'HootSuite Profiles',
			field: 'hootSuiteProfiles',
			width: 100,
			minWidth: 100,
			cellRendererFramework: HootSuiteCellRenderer,
		}
	];

	constructor(
		public socialService: SocialService,
		private activatedRoute: ActivatedRoute,
		private location: Location,
		private modalService: NgxSmartModalService
	) {}

	ngOnDestroy() {}

	ngOnInit() {
		this.socialAccounts$ = this.socialService.socialAccounts$();
		const pendingCallback = localStorage.getItem(ILocalStorage.PendingRequest) === 'true';

		const error = this.activatedRoute.snapshot.queryParams.error as string;
		const success = this.activatedRoute.snapshot.queryParams.success as string;

		if (pendingCallback && (error || success)) {
			this.setBanner(error, success);

			this.clearBanner();

			localStorage.removeItem(ILocalStorage.PendingRequest);
			localStorage.removeItem(ILocalStorage.AccountType);
			this.location.replaceState('admin');
		}

		this.socialService.deleteSuccess$.pipe(skip(1)).subscribe(s => {
			if (s) {
				this.callbackMessage = 'Account successfully removed';
				this.callbackStatus = 'success';
				this.clearBanner();
			} else {
				this.callbackMessage = 'Failed to remove account';
				this.callbackStatus = 'error';
				this.clearBanner();
			}
		});

		this.socialService.errors$.pipe(skip(1)).subscribe(s => {
			localStorage.removeItem(ILocalStorage.PendingRequest);
			localStorage.removeItem(ILocalStorage.AccountType);
			this.callbackMessage = s;
			this.callbackStatus = 'error';
			this.clearBanner();
		});
	}

	setBanner(error: string, success: string) {
		if (error) {
			this.callbackMessage = error;
		} else if (success) {
			const message = `Account for ${localStorage.getItem('account_type')} successfully connected`;
			this.callbackMessage = message;
		}

		const status = error ? 'error' : 'success';
		this.callbackStatus = status;
	}

	clearBanner() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.timeoutId = setTimeout(() => {
			this.callbackMessage = '';
			this.callbackStatus = '';
		}, 6000);
	}

	connectFacebook() {
		this.connect(ISocialAccountEnum.Facebook);
	}

	connectTwitter() {
		this.connect(ISocialAccountEnum.Twitter);
	}

	connectHootSuite() {
		this.connect(ISocialAccountEnum.HootSuite);
	}

	connect(type: ISocialAccountEnum) {
		this.socialService.registerAccount(type);
		this.socialService.authorizedUrl$
			.pipe(skip(1)) // ignore initial empty value.
			.subscribe(url => {
				localStorage.setItem(ILocalStorage.PendingRequest, 'true');
				localStorage.setItem(ILocalStorage.AccountType, type);
				window.location.href = url;
			});
	}

	onDeleteButton(id: string) {
		this.id = id;
		this.modalService.get('delete-modal').open();
	}

	onCancel() {
		this.close();
	}

	onOK() {
		this.close();
		this.socialService.deleteAccount(this.id);
	}

	close() {
		this.modalService.get('delete-modal').close();
	}
}
