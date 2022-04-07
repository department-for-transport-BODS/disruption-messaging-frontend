import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'dm-comment',
	templateUrl: './comment.component.html',
	styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
	@Input() author: string;
	@Input() date: string;
	@Input() message: string;
	@Input() last: boolean;
	constructor() {}

	outputClasses: string[] = ['comment'];
	commentClasses = '';

	ngOnInit() {
		if (!this.message) {
			this.outputClasses.push(`comment--no-message`);
		}
		if (this.last) {
			this.outputClasses.push(`comment--last`);
		}

		this.commentClasses = this.outputClasses.join(' ');
	}
}
