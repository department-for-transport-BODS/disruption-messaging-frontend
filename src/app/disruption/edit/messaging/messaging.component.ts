import { Component, forwardRef, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged, startWith, mapTo } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { BaseControlValueAccessor } from 'src/app/shared/forms/BaseControlValueAccessor';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormGroup,
	FormControl,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ValidationErrors
} from '@angular/forms';
import { MessagingComponentForm } from './messaging-component-form';
import { FormGroupHelper } from 'src/app/shared/forms/FormGroupHelper';
import { Subscription } from 'rxjs';
import { IFormSubmittedState } from 'src/app/shared/forms/FormStateEnum';
import { EditDisruptionService } from '../edit-disruption.service';
import { IEditDisruptionViewModel, IEditSocialMessageViewModel } from '../edit-disruption.view.model';
import * as moment from 'moment';
import { messagingRequiredValidator, messagingPublishOnValidator } from './messaging.validator';
import { SocialService } from '../../../social/social.service';
import { ISocialAccountViewModel } from '../../../social/social.view.model';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { IHootSuiteProfileType } from 'src/generated/graphql';
import { IHootSuiteProfileProfileType } from 'src/generated/enum-overrides';
import { TwitterUserSearchService } from '../../edit/twitter-user-search.service';
import { ITwitterSearchList } from '../../../../../src/generated/graphql';
import { FileHandlerService } from '../../edit/file-handler.service';

@Component({
	selector: 'dm-messaging',
	templateUrl: './messaging.component.html',
	styleUrls: ['./messaging.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MessagingComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MessagingComponent),
			multi: true
		}
	]
})
export class MessagingComponent extends BaseControlValueAccessor<MessagingComponentForm[]>
	implements OnInit, OnDestroy {
	private messageChangingSubscription: Subscription;
	private statusChangeSubscription: Subscription;
	private submitStatus: IFormSubmittedState;

	control: AbstractControl;
	messagingGroup: FormGroup;
	allAccounts: ISocialAccountViewModel[];
	allAccountsSubscription: Subscription;
	messageArraySubscription: Subscription[] = [];
	twitterSocialIDArray: string[] = [];

	twitterUsers: any[] = [];
	slug = '';
	searchDone = false;
	searchIndex: number;
	isLoading = false;
	noResultsFound = false;
	acceptedImageTypes = ['image/png', 'image/jpeg'];
	isUnsupportedFileType = false;
	isFileSizeError = false;
	typeToSearch = false;

	constructor(
		private formBuilder: FormBuilder,
		private editDisruptionService: EditDisruptionService,
		private socialAccountsService: SocialService,
		private twitterUserSearchService: TwitterUserSearchService,
		private fileHandlerService: FileHandlerService
	) {
		super();
	}

	ngOnInit() {
		this.initNewForm(0);

		this.messagingGroup.valueChanges.subscribe(val => {
			FormGroupHelper.likeAVirgin(this.messagingGroup);
			this.submitStatus = IFormSubmittedState.Pending;
			this.value = val;
			this.onChange(val);
		});

		this.editDisruptionService.formSubmitStatus$.subscribe(val => {
			this.submitStatus = val;
			if (val !== IFormSubmittedState.Pending) {
				this.messagingGroup.markAllAsTouched();
			}
		});

		this.editDisruptionService.currentDisruption$.subscribe(currentDisruption => {
			if (currentDisruption) {
				this.patchValues(currentDisruption);
			} else {
				this.messageArr.clear();
				this.messagingGroup.reset();
				this.addMessage(0);
			}
		});

		this.allAccountsSubscription = this.socialAccountsService
			.socialAccounts$()
			.subscribe(
				res => {
					this.allAccounts = res;
				}
			);
	}

	ngOnDestroy() {
		if (this.messageChangingSubscription) {
			this.messageChangingSubscription.unsubscribe();
		}

		if (this.statusChangeSubscription) {
			this.statusChangeSubscription.unsubscribe();
		}

		if (this.allAccountsSubscription) {
			this.allAccountsSubscription.unsubscribe();
		}

		if (this.messageArraySubscription) {
			this.messageArraySubscription.forEach(s => s.unsubscribe());
		}
	}

	private initNewForm(idx: number) {
		this.messagingGroup = this.formBuilder.group({
			messages: this.formBuilder.array([])
		});
		this.addMessage(idx);
	}

	private patchValues(viewModel: IEditDisruptionViewModel) {
		if (viewModel.socialMessages && viewModel.socialMessages.length) {
			this.messageArr.clear();
			this.twitterUsers = [];
			viewModel.socialMessages.map((msg: IEditSocialMessageViewModel, index) => {
				const messageForm = this.createForm();
				messageForm.patchValue({
					text: msg.text,
					image: msg.image,
					socialAccount: msg.socialAccount ? msg.socialAccount : null,
					hootSuiteProfile: msg.hootSuiteProfile,
					publishOn: msg.publishOn,
					id: msg.id,
					publishedOn: msg.publishedOn ? DateFormatter.shortDateAndTime(msg.publishedOn.toISOString()) : '',
					published: msg.published,
					lastPublishError: msg.lastPublishedError
				});
				this.addMessage(index, messageForm);
				let twitterSocialID = null;
				if (msg.hootSuiteProfile && msg.hootSuiteProfile.profileType === 'A_1' as IHootSuiteProfileProfileType) {
					twitterSocialID = msg.hootSuiteProfile.socialId;
				}
				this.twitterSocialIDArray.push(twitterSocialID);
			});
		}
	}

	get messageArr(): FormArray {
		return this.messagingGroup.get('messages') as FormArray;
	}

	get submittedForPublish(): boolean {
		return this.submitStatus === IFormSubmittedState.Publish;
	}

	itemSelectedEvent(value) {
		let val = this.text(value.index).value;
		const substring = val.substring(val.indexOf('@' + this.slug));
		val = value.item !== '' ? val.replace(substring, '@' + value.item) : val.replace(substring, '');
		this.setText(value.index, val);
		this.searchDone = true;
	}

	// startAt date
	startAt(idx: number): moment.Moment {
		if (idx !== undefined) {
			const message = this.messageArr.at(idx) as FormGroup;

			if (message !== null && message.get('publishOn').value) {
				return message.get('publishOn').value;
			}
		}

		return moment()
			.add(1, 'day')
			.hours(7)
			.minutes(0);
	}

	setText(index: number, value: string) {
		this.messageArr.at(index).get('text').setValue(value);
	}

	image(idx: number) {
		return this.messageArr.at(idx).get('image');
	}

	setImage(index: number, value) {
		this.messageArr.at(index).get('image').setValue(value);
	}

	text(idx: number) {
		return this.messageArr.at(idx).get('text');
	}

	account(idx: number) {
		return this.messageArr.at(idx).get('socialAccount').value;
	}

	private createForm() {
		return this.formBuilder.group(
			new MessagingComponentForm(),
			{ validators: [messagingRequiredValidator, messagingPublishOnValidator] });
	}

	addMessage(index, form = null): void {
		if (!form) {
			form = this.createForm();
		}

		this.messageArr.push(form);
		this.messageArraySubscription.push(form.valueChanges.pipe().pipe(debounceTime(200), distinctUntilChanged()).subscribe(changes => {
			this.isLoading = false;
			this.noResultsFound = false;
			this.typeToSearch = false;
			this.twitterUsers = [];
			this.messageAdded(index);
		}));
	}

	addNewMessage(): void {
		this.twitterUsers = [];
		this.addMessage(this.messageArr.length);
		this.twitterSocialIDArray.push(null);
	}

	removeMessage(idx: number): void {
		this.messageArr.removeAt(idx);
		this.twitterSocialIDArray.splice(idx, 1);
		if (!this.messageArr.length) {
			this.initNewForm(0);
		}
	}

	accountName(id: string): string {
		if (this.allAccounts && this.allAccounts.length) {
			const acc = this.allAccounts.find(f => f.id === id);
			return acc ? `${acc.displayName} (${acc.accountType})` : '';
		}

		return '';
	}

	formatDate(date: moment.Moment): string {
		return DateFormatter.shortDateAndTime(date.toISOString());
	}

	publishStatusMessage(idx: number) {
		const msg = this.messageArr.at(idx);
		const error = msg.get('lastPublishError');
		const publishedOn = msg.get('publishedOn');

		if (msg.get('published').value) {
			if (error.value) {
				return `Failed to publish: ${error.value}`;
			}

			const txt = 'Successfully published';
			if (publishedOn.value) {
				return `${txt} on ${publishedOn.value}`;
			} else {
				return txt;
			}
		}

		return 'Pending';
	}

	getProfileDisplay(profile: IHootSuiteProfileType) {
		return (profile.socialUsername || profile.socialId) + ' (' + IHootSuiteProfileProfileType[profile.profileType] + ')';
	}

	showHootSuiteProfile(idx: number) {
		const sa = this.allAccounts && this.allAccounts.find(account => account.id === this.account(idx));
		return sa ? sa.isHootSuite : false;
	}

	autoFill(idx: number): void {
		if (this.editDisruptionService.description) {
			this.messageArr
				.at(idx)
				.get('text')
				.setValue(this.editDisruptionService.description.slice(0, 280));
		}
	}

	isSingleWordSearchString(value: string) {
		let retVal = false;
		if (value.includes('@') && !(value.includes(' '))) {
			retVal = true;
		}
		return retVal;
	}

	isMultiWordSearchString(value: string) {
		let retVal = false;
		if (value.lastIndexOf('@') > value.lastIndexOf(' ')) {
			retVal = true;
		}
		return retVal;
	}


	messageAdded(index) {
		if (!this.searchDone) {
			this.twitterUsers = [];
			this.slug = '';
			const value = this.text(index).value;
			if (value !== null) {
				if ((value.includes('@') && value.includes(' ')) && this.isMultiWordSearchString(value) ||
					this.isSingleWordSearchString(value)) {
					this.slug = value.substring(value.lastIndexOf('@') + 1);
					this.searchIndex = index;
					if (this.slug !== '') {
						this.typeToSearch = false;
						this.isLoading = true;
						this.twitterUserSearchService.getTwitterUsers(this.slug).subscribe(val => {
							this.twitterUsers = [];
							this.isLoading = false;
							this.populate(val);
						}
						);
					} else {
						this.isLoading = false;
						this.typeToSearch = true;
					}
				}
			}
		} else {
			this.searchDone = !this.searchDone;
		}
	}

	populate(val) {
		val.map((msg) => {
			this.twitterUsers.push(msg.screenName);
		});
		if (this.twitterUsers.length === 0) {
			this.noResultsFound = true;
		}
	}

	isEditable(message: FormControl) {
		if (message.value.socialAccount && message.value.socialAccount.isHootSuite) {
			const publishOn = message.value.publishOn;
			return !message.value.published || !publishOn || publishOn > moment.now();
		} else {
			return !message.value.published;
		}
	}

	formInvalid(idx) {
		const thisMessage = this.messageArr.at(idx);
		return thisMessage.errors ? thisMessage.errors.required : false;
	}

	propInvalid(propName: string, idx: number): boolean {
		const thisMessage = this.messageArr.at(idx);
		const prop = thisMessage.get(propName);
		const formInvalid = this.formInvalid(idx);
		return prop.invalid || (formInvalid && !prop.value);
	}

	writeValue(messages: MessagingComponentForm[]) {
		if (messages !== null) {
			super.writeValue(messages);
			while (this.messageArr.length > 0) {
				this.messageArr.removeAt(0);
			}
		}
	}

	validate(c: AbstractControl): ValidationErrors | null {
		this.control = c;
		const errors = FormGroupHelper.getAllErrors(this.messagingGroup);
		return this.messagingGroup.valid ? null : errors;
	}

	onValueChange(selection: IHootSuiteProfileType, index: number) {
		// Im so glad we can bind to this event otherwise we would have to maintain a subscription array
		// listing to every possible profile change.
		if (selection && selection.profileType === 'A_1' as IHootSuiteProfileProfileType) {
			this.twitterSocialIDArray[index] = selection.socialId;
		} else {
			// push null to preserve the index/socialID paring
			this.twitterSocialIDArray[index] = null;
		}
	}


	/**
	 * on file drop handler
	 */
	onFileDropped(idx, $event) {
		const file = this.fileHandlerService.prepareFilesList($event, this.acceptedImageTypes);
		if (file) {
			this.setImage(idx, file);
		}
		this.isFileSizeError = this.fileHandlerService.isFileSizeError;
		this.isUnsupportedFileType = this.fileHandlerService.isUnsupportedFileType;
	}

	/**
	 * handle file from browsing
	 */
	fileBrowseHandler(idx, files) {
		const file = this.fileHandlerService.prepareFilesList(files, this.acceptedImageTypes);
		if (file) {
			this.setImage(idx, file);
		}
		this.isFileSizeError = this.fileHandlerService.isFileSizeError;
		this.isUnsupportedFileType = this.fileHandlerService.isUnsupportedFileType;
	}

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.setImage(index, null);
	}
}
