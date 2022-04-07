import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ReviewDisruptionService } from './review-disruption.service';

@Component({
	selector: 'dm-approve-reject-disruption',
	templateUrl: './approve-disruption.component.html',
	styleUrls: ['./approve-disruption.component.scss']
})
export class ApproveDisruptionComponent implements OnInit, OnDestroy {
	@Input() id: number;

	private statusSubscription: Subscription;
	private errorsSubscription: Subscription;

	public status: string;
	public serverErrors: string;
	public comments: string;

	constructor(
		private disruptionReviewService: ReviewDisruptionService,
		private ngxSmartModalService: NgxSmartModalService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.statusSubscription = this.disruptionReviewService.status$.subscribe(val => {
			this.status = val;
			if (this.status === 'success') {
				this.onComplete();
			}
		});

		this.errorsSubscription = this.disruptionReviewService.errors$.subscribe(val => {
			this.serverErrors = val;
		});
	}

	ngOnDestroy() {
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe();
		}

		if (this.errorsSubscription) {
			this.errorsSubscription.unsubscribe();
		}
	}

	resetState() {
		this.disruptionReviewService.reset();
		this.comments = '';
	}

	onApproveButton() {
		this.disruptionReviewService.setStatus('approve');
		this.ngxSmartModalService.get('approve-modal').open();
	}

	onRejectButton() {
		this.disruptionReviewService.setStatus('reject');
		this.ngxSmartModalService.get('approve-modal').open();
	}

	onCancel() {
		this.ngxSmartModalService.get('approve-modal').close();
	}

	onApprove() {
		this.disruptionReviewService.approve(this.id);
	}

	onReject() {
		this.disruptionReviewService.reject(this.id, this.comments);
	}

	onComplete() {
		this.ngxSmartModalService.get('approve-modal').close();
		// reload reviews list
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl('/reviews'));
	}
}
