import { ICommentType } from 'src/generated/graphql';
import { DateFormatter } from '../formatters/date.formatter';

export class CommentViewModel {
	comment: string;
	username: string;
	createdDate: string;

	constructor(gqlComment: ICommentType) {
		this.comment = gqlComment.comment;
		this.username = gqlComment.user ? gqlComment.user.username : '';
		this.createdDate =  DateFormatter.shortDateAndTime(gqlComment.created);
	}
}
