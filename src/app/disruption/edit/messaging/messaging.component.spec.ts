import { async, ComponentFixture, fakeAsync, TestBed, tick, flush } from '@angular/core/testing';

import { MessagingComponent } from './messaging.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessagingComponentForm } from './messaging-component-form';
import * as moment from 'moment';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { SocialService } from 'src/app/social/social.service';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ISocialAccountViewModel } from 'src/app/social/social.view.model';
import { ISocialRegistrationAccountType, IHootSuiteProfileProfileType } from 'src/generated/enum-overrides';
import {
	triggerKeyDownEvent,
	getNgSelectElement,
	tickAndDetectChanges,
	selectOption,
	KeyCode,
	flushTickAndDetectChanges
} from 'src/app/shared/testing/ng-select-helpers';
import { IHootSuiteProfileType } from 'src/generated/graphql';
import { EditDisruptionService } from '../edit-disruption.service';
import { messagingPublishOnValidator } from './messaging.validator';
import { TwitterUserSearchService } from '../../edit/twitter-user-search.service';
import { FileHandlerService } from '../../edit/file-handler.service';

describe('MessagingComponent', () => {
	let component: MessagingComponent;
	let fixture: ComponentFixture<MessagingComponent>;
	let twitterSearchService: TwitterUserSearchService;
	let fileHandlerService: FileHandlerService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessagingComponent],
			imports: [
				CommonModule,
				SharedModule,
				ReactiveFormsModule,
				FormsModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				ApolloTestingModule,
				RouterTestingModule,
				HttpClientTestingModule
			],
		}).compileComponents();
	}));

	beforeEach(async(() => {
		twitterSearchService = TestBed.get(TwitterUserSearchService);
		fileHandlerService = TestBed.get(FileHandlerService);
		fixture = TestBed.createComponent(MessagingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should validate message for Profanity.', fakeAsync(() => {
		expect(component).toBeTruthy();
		// Apologies for profanity, but its a profanity test.
		component.ngOnInit();
		fixture.detectChanges();
		tick();
		const text = fixture.debugElement.query(By.css('#message-text-0'));
		text.nativeElement.value = 'Assface';
		text.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		flushTickAndDetectChanges(fixture);

		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Please refrain from using profane words in text.');
	}));

	it('should limit long url to 23 characters and go over 280 if needed', fakeAsync(() => {
		expect(component).toBeTruthy();
		// Apologies for profanity, but its a profanity test.
		component.ngOnInit();
		fixture.detectChanges();
		tick();
		const text = fixture.debugElement.query(By.css('#message-text-0'));
		const longURL = 'www.example.com/an/incredibly/long/path/?this=is&a=very&long=set&of=queryparams';
		text.nativeElement.value = `paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpadding
		paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpadding
		This string, if my calculations are correct, should be 256 characters see url ${longURL}`;
		text.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		flushTickAndDetectChanges(fixture);

		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors).toBeNull();
	}));

	it('should fail validation if text contains more than 280 characters', fakeAsync(() => {
		expect(component).toBeTruthy();
		// Apologies for profanity, but its a profanity test.
		component.ngOnInit();
		fixture.detectChanges();
		tick();
		const text = fixture.debugElement.query(By.css('#message-text-0'));
		text.nativeElement.value = `paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpadding
		paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpad
		paddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpaddingpad`;
		text.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		flushTickAndDetectChanges(fixture);

		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors.nativeElement.innerText).toBe('Message must be no more than 280 characters');
	}));

	it('should allow white-listed profane words', fakeAsync(() => {
		expect(component).toBeTruthy();
		// Apologies for profanity, but its a profanity test.
		component.ngOnInit();
		fixture.detectChanges();
		tick();
		const text = fixture.debugElement.query(By.css('#message-text-0'));
		text.nativeElement.value = 'shit';
		text.nativeElement.dispatchEvent(new Event('input'));

		tick();
		fixture.detectChanges();

		flushTickAndDetectChanges(fixture);
		const formErrors = fixture.debugElement.query(By.css('.form__feedback'));
		expect(formErrors).toBeNull();
	}));

	it('should return publish error', () => {
		component.ngOnInit();

		const date = moment();
		const form = new FormBuilder().group(new MessagingComponentForm());
		form.patchValue({
			text: 'text message',
			image: { url: 'test/image.png', name: 'image.png'},
			socialAccount: null,
			publishOn: date,
			id: '1',
			publishedOn: DateFormatter.shortDateAndTime(date.toISOString()),
			published: true,
			lastPublishError: 'An error'
		});
		component.messageArr.clear();
		component.messageArr.push(form);
		fixture.detectChanges();

		const result = component.publishStatusMessage(0);

		expect(result).toBe('Failed to publish: An error');
	});

	it('should add loading popover', fakeAsync(() => {
		component.ngOnInit();
		component.messageArr.at(0).get('text').setValue('@a');
		flushTickAndDetectChanges(fixture);

		expect(component.isLoading).toBe(true);
		expect(component.typeToSearch).toBe(false);

		const popover = fixture.debugElement.query(By.css('.twitter-search__item'));
		expect(popover.nativeElement.innerText).toBe('Loading...');
	}));

	it('should add no results found popover', fakeAsync(() => {

		const featureObs = cold('--a|', { a: [] });
		const featuresSpy = spyOn(twitterSearchService, 'getTwitterUsers').and.returnValue(featureObs);

		component.ngOnInit();
		component.messageArr.at(0).get('text').setValue('@a');

		flushTickAndDetectChanges(fixture);
		flushTickAndDetectChanges(fixture);

		expect(featuresSpy).toHaveBeenCalled();
		expect(component.noResultsFound).toBe(true);

		const popover = fixture.debugElement.query(By.css('.twitter-search__item'));
		expect(popover.nativeElement.innerText).toBe('No results found');
	}));

	it('should add type to search twitter handles popover', fakeAsync(() => {

		component.ngOnInit();
		component.messageArr.at(0).get('text').setValue('@');

		flushTickAndDetectChanges(fixture);

		expect(component.typeToSearch).toBe(true);
		expect(component.isLoading).toBe(false);

		const popover = fixture.debugElement.query(By.css('.twitter-search__item'));
		expect(popover.nativeElement.innerText).toBe('Type to search Twitter handles');
	}));

	it('should add results in popover', fakeAsync(() => {

		const feature =
			[{ screenName: 'abc', id: '1' },
			{ screenName: 'acd', id: '2' },
			{ screenName: 'adf', id: '3' },
			{ screenName: 'aef', id: '4' },
			{ screenName: 'afd', id: '5' }, ];

		const featureObs = cold('--a|', { a: feature });
		const featuresSpy = spyOn(twitterSearchService, 'getTwitterUsers').and.returnValue(featureObs);

		component.ngOnInit();
		component.messageArr.at(0).get('text').setValue('@a');

		flushTickAndDetectChanges(fixture);
		flushTickAndDetectChanges(fixture);

		expect(featuresSpy).toHaveBeenCalled();
		expect(component.noResultsFound).toBe(false);
		expect(component.isLoading).toBe(false);

		const popover = fixture.debugElement.queryAll(By.css('.popover__item'));
		expect(popover.length).toBe(5);


	}));

	it('should call fileBrowseHandler event', fakeAsync(() => {
		expect(component).toBeTruthy();
		component.ngOnInit();
		fixture.detectChanges();
		const text = fixture.debugElement.query(By.css('#message-image-0'));

		spyOn(component, 'fileBrowseHandler');
		text.nativeElement.dispatchEvent(new Event('change'));
		expect(component.fileBrowseHandler).toHaveBeenCalled();
	}));

	it('should add file name in frontend', fakeAsync(() => {
		const fileName = 'image.png';
		expect(component).toBeTruthy();
		component.ngOnInit();
		fixture.detectChanges();
		component.setImage(0, new File([''], fileName, {type: 'image/png'}));
		component.isFileSizeError = false;

		flushTickAndDetectChanges(fixture);

		const fileNameElement = fixture.debugElement.query(By.css('.info'));
		expect(fileNameElement.nativeElement.innerText).toBe(fileName);
	}));


	it('should delete file when delete button is clicked', fakeAsync(() => {
		const fileName = 'image.png';
		expect(component).toBeTruthy();
		component.ngOnInit();
		fixture.detectChanges();
		component.setImage(0, new File([''], fileName, {type: 'image/png'}));
		component.isFileSizeError = false;

		flushTickAndDetectChanges(fixture);
		flushTickAndDetectChanges(fixture);

		const fileNameElement = fixture.debugElement.query(By.css('.info'));
		expect(fileNameElement.nativeElement.innerText).toBe(fileName);

		const deleteFile = fixture.debugElement.query(By.css('.delete'));

		spyOn(component, 'deleteFile');
		deleteFile.nativeElement.dispatchEvent(new Event('click'));
		expect(component.deleteFile).toHaveBeenCalled();
		component.setImage(0, null);

		flushTickAndDetectChanges(fixture);

		const fileElement = fixture.debugElement.query(By.css('.info'));
		expect(fileElement).toBe(null);
	}));

	it('should display file large error', fakeAsync(() => {
		const fileName = 'image.png';
		expect(component).toBeTruthy();
		component.ngOnInit();
		fixture.detectChanges();
		component.isFileSizeError = true;
		flushTickAndDetectChanges(fixture);

		const fileSizeError = fixture.debugElement.query(By.css('.file-validation-error'));
		expect(fileSizeError.nativeElement.innerText).toBe('Upload image size should be less than 4MB.');
	}));

	it('should display file type error', fakeAsync(() => {
		const fileName = 'image.xml';
		expect(component).toBeTruthy();
		component.ngOnInit();
		fixture.detectChanges();
		component.isUnsupportedFileType = true;

		flushTickAndDetectChanges(fixture);

		const fileSizeError = fixture.debugElement.query(By.css('.file-validation-error'));
		expect(fileSizeError.nativeElement.innerText).toBe('Upload image type should be .png or .jpg.');
	}));

	it('should return publish status message with date', () => {
		component.ngOnInit();

		const date = moment();
		const form = new FormBuilder().group(new MessagingComponentForm());
		form.patchValue({
			text: 'text message',
			image: { url: 'test/image.png', name: 'image.png'},
			socialAccount: null,
			publishOn: date,
			id: '1',
			publishedOn: DateFormatter.shortDateAndTime(date.toISOString()),
			published: true,
			lastPublishError: null
		});
		component.messageArr.clear();
		component.messageArr.push(form);
		fixture.detectChanges();

		const result = component.publishStatusMessage(0);
		const formattedDate = DateFormatter.shortDateAndTime(date.toISOString());
		expect(result).toBe('Successfully published on ' + formattedDate);
	});

	it('should return publish status message', () => {
		component.ngOnInit();

		const date = moment();
		const form = new FormBuilder().group(new MessagingComponentForm());
		form.patchValue({
			text: 'text message',
			image: { url: 'test/image.png', name: 'image.png'},
			socialAccount: null,
			publishOn: date,
			id: '1',
			publishedOn: null,
			published: true,
			lastPublishError: null
		});
		component.messageArr.clear();
		component.messageArr.push(form);
		fixture.detectChanges();

		const result = component.publishStatusMessage(0);
		expect(result).toBe('Successfully published');
	});

	it('should remove message at chosen index', () => {
		component.ngOnInit();

		const date = moment();
		const form = new FormBuilder().group(new MessagingComponentForm());
		form.patchValue({
			text: 'text message',
			image: { url: 'test/image.png', name: 'image.png'},
			socialAccount: null,
			publishOn: date,
			id: '1',
			publishedOn: DateFormatter.shortDateAndTime(date.toISOString()),
			published: true,
			lastPublishError: 'An error'
		});
		component.messageArr.push(form);

		fixture.detectChanges();

		component.removeMessage(1);

		expect(component.messageArr.length).toBe(1);
	});
});


describe('HootSuite tests', () => {
	let component: MessagingComponent;
	let fixture: ComponentFixture<MessagingComponent>;
	let service: SocialService;
	let disruptionService: EditDisruptionService;
	let allAccountsSpy;
	const allSocialAccounts: ISocialAccountViewModel[] = [{
		username: 'org-admin',
		organisation: 'york',
		createdBy: 'org-admin',
		prettyName: 'user good name',
		email: 'user@hootsuite.com',
		name: 'hootsuite-name',
		displayName: 'twitter-hootsuite',
		accountType: ISocialRegistrationAccountType.A_3,
		isHootSuite: true,
		hootSuiteProfiles: [{
			// For the purpose of testing we are assuming that socialId can have letters
			id: '111',
			profileType: 'A_1' as IHootSuiteProfileProfileType,
			profileId: '1234',
			socialId: 'twitter1',
			socialUsername: null,
			socialMessages: null
		} as IHootSuiteProfileType,
		{
			id: '112',
			profileType: 'A_1' as IHootSuiteProfileProfileType,
			profileId: '1235',
			socialId: 'twitter2',
			socialUsername: null,
			socialMessages: null
		} as IHootSuiteProfileType,
		{
			id: '113',
			profileType: 'A_2' as IHootSuiteProfileProfileType,
			profileId: '1236',
			socialId: 'facebook1',
			socialUsername: null,
			socialMessages: null
		} as IHootSuiteProfileType,
		]
	}];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MessagingComponent],
			imports: [
				CommonModule,
				SharedModule,
				ReactiveFormsModule,
				FormsModule,
				NgSelectModule,
				ReactiveFormsModule,
				NgxSmartModalModule.forRoot(),
				OwlDateTimeModule,
				OwlMomentDateTimeModule,
				ApolloTestingModule,
				RouterTestingModule,
				HttpClientTestingModule
			]
		}).compileComponents();
	}));

	beforeEach(async(() => {
		fixture = TestBed.createComponent(MessagingComponent);
		disruptionService = TestBed.get(EditDisruptionService);
		service = fixture.debugElement.injector.get(SocialService);
		const obs = cold('a|', { a: allSocialAccounts });
		allAccountsSpy = spyOn(service, 'socialAccounts$').and.returnValue(obs);
		component = fixture.componentInstance;
		fixture.detectChanges();
		fixture.whenStable();
	}));

	it('should populate social accounts dropdown', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(allAccountsSpy).toHaveBeenCalled();

		triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space);
		tickAndDetectChanges(fixture);

		const ngOption = fixture.debugElement.query(By.css('.ng-option'));
		expect(ngOption.children[0].nativeElement.innerText).toBe('twitter-hootsuite (HootSuite)');

		const profileDropdown = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));
		expect(profileDropdown).toBeFalsy();

	}));

	it('should show hootsuite profiles dropdown', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(allAccountsSpy).toHaveBeenCalled();

		selectOption(fixture, KeyCode.ArrowDown, 0);
		tickAndDetectChanges(fixture);

		flushTickAndDetectChanges(fixture);

		const profileDropdown = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));
		expect(profileDropdown).toBeTruthy();
	}));

	it('should populate hootsuite profile dropdown', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(allAccountsSpy).toHaveBeenCalled();

		selectOption(fixture, KeyCode.ArrowDown, 0);
		tickAndDetectChanges(fixture);

		const profileDropdown = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));
		expect(profileDropdown).toBeTruthy();

		triggerKeyDownEvent(profileDropdown, KeyCode.Space);
		flushTickAndDetectChanges(fixture);

		const ngOption = fixture.debugElement.query(By.css('.ng-option'));
		expect(ngOption.children[0].nativeElement.innerText).toBe('twitter1 (Twitter)');
	}));

	it('should trigger HootSuite publishOn validation', fakeAsync(() => {
		component.ngOnInit();

		const form = new FormBuilder().group(new MessagingComponentForm(), { validators: [messagingPublishOnValidator] });
		form.patchValue({
			text: 'text message',
			image: null,
			socialAccount: {
				isHootSuite: true
			},
			publishOn: moment(),
			id: '1',
			publishedOn: null,
			published: false,
			lastPublishError: null,
		});
		component.messageArr.clear();
		component.messageArr.push(form);
		fixture.detectChanges();

		expect(form.errors).toEqual({ incorrect_publish: true });
	}));

	it('should show twitter profile link when twitter is selected', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(allAccountsSpy).toHaveBeenCalled();

		selectOption(fixture, KeyCode.ArrowDown, 0);
		tickAndDetectChanges(fixture);

		const profileDropdown = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));

		triggerKeyDownEvent(profileDropdown, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		flushTickAndDetectChanges(fixture);

		const twitterLink = fixture.debugElement.query(By.css('#twitter-link-0'));
		expect(twitterLink).toBeTruthy();
		expect(twitterLink.nativeElement.innerText).toBe('Twitter/twitter1');
	}));

	it('should retain link order for two hootsuite accounts if one is removed', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		// Select social account
		const accountDropdown1 = fixture.debugElement.query(By.css('#message-0-account'));
		triggerKeyDownEvent(accountDropdown1, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(accountDropdown1, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		// Select Twitter1 Hootsuite
		const profileDropdown1 = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));
		triggerKeyDownEvent(profileDropdown1, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown1, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		component.addNewMessage();
		tickAndDetectChanges(fixture);

		// Select social account
		const accountDropdown2 = fixture.debugElement.query(By.css('#message-1-account'));
		triggerKeyDownEvent(accountDropdown2, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(accountDropdown2, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		// Select Twitter2 Hootsuite
		const profileDropdown2 = fixture.debugElement.query(By.css('#message-1-hootsuite-profile'));
		triggerKeyDownEvent(profileDropdown2, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown2, KeyCode.ArrowDown); // move down
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown2, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		// test everything is set up properly
		let twitterLink1 = fixture.debugElement.query(By.css('#twitter-link-0'));
		const twitterLink2 = fixture.debugElement.query(By.css('#twitter-link-1'));
		expect(twitterLink1.nativeElement.innerText).toBe('Twitter/twitter1');
		expect(twitterLink2.nativeElement.innerText).toBe('Twitter/twitter2');
		flushTickAndDetectChanges(fixture);

		// Delete the first form
		component.removeMessage(0);
		tickAndDetectChanges(fixture);

		// twitter link 2 should be in the first position now
		twitterLink1 = fixture.debugElement.query(By.css('#twitter-link-0'));
		expect(twitterLink1.nativeElement.innerText).toBe('Twitter/twitter2');
	}));

	it('should show not show twitter profile link when twitter is selected then deselected', fakeAsync(() => {
		component.ngOnInit();
		getTestScheduler().flush();
		fixture.detectChanges();

		expect(allAccountsSpy).toHaveBeenCalled();

		selectOption(fixture, KeyCode.ArrowDown, 0);
		tickAndDetectChanges(fixture);

		const profileDropdown = fixture.debugElement.query(By.css('#message-0-hootsuite-profile'));

		triggerKeyDownEvent(profileDropdown, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		let twitterLink = fixture.debugElement.query(By.css('#twitter-link-0'));
		expect(twitterLink).toBeTruthy();
		expect(twitterLink.nativeElement.innerText).toBe('Twitter/twitter1');

		// now check it disappears when deselected
		triggerKeyDownEvent(profileDropdown, KeyCode.Space); // open
		tickAndDetectChanges(fixture);
		triggerKeyDownEvent(profileDropdown, KeyCode.ArrowDown); // move down
		triggerKeyDownEvent(profileDropdown, KeyCode.ArrowDown); // move down
		triggerKeyDownEvent(profileDropdown, KeyCode.ArrowDown); // move down
		tickAndDetectChanges(fixture);
		// should be on facebook now
		triggerKeyDownEvent(profileDropdown, KeyCode.Enter);
		tickAndDetectChanges(fixture);

		flushTickAndDetectChanges(fixture);

		twitterLink = fixture.debugElement.query(By.css('#twitter-link-0'));
		expect(twitterLink).toBeNull();
	}));
});
