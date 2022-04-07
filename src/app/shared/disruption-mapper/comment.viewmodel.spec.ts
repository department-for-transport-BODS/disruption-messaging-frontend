import { CommentViewModel } from './comment.viewmodel';
import { ICommentType } from 'src/generated/graphql';
import moment from 'moment';

describe('CommentViewModel', () => {
	let node: ICommentType;
	let vm: CommentViewModel;

	beforeEach(() => {
		node = {
			comment: 'this is my comment',
			created: '2019-08-29T01:00:04',
			user: {
				id: '66',
				username: 'bstokes',
				email: 'bstokes@ecb.uk'
			},
			disruption: null,
			id: '623',
			modified: null
		};

		vm = new CommentViewModel(node);
	});

	it('should map the comment', () => {
		expect(vm.comment).toBe(node.comment);
	});

	it('should map the username', () => {
		expect(vm.username).toBe(node.user.username);
	});

	it('should map empty username', () => {
		node.user = null;
		const newVm = new CommentViewModel(node);
		expect(newVm.username).toBe('');
	});

	it('should map the created date', () => {
		console.log(vm.createdDate);
		const createdMoment = moment(vm.createdDate, 'DD/MM/YYYY HH:mm:ss').format();
		expect(createdMoment).toBe(moment.utc('2019-08-29 01:00:04').local().format());
	});
});
