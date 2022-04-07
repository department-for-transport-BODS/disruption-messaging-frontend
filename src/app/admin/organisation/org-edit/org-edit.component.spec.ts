import {async, ComponentFixture, fakeAsync, TestBed, flush, tick} from '@angular/core/testing';
import {OrgEditComponent} from './org-edit.component';
import {SharedModule} from '../../../shared/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ApolloTestingModule} from 'apollo-angular/testing';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {OrganisationService} from '../organisation.service';
import {cold} from 'jasmine-marbles';
import {OrganisationViewModel} from '../organisation.viewmodel';
import {AdminAreasService} from '../admin_areas.service';
import {By} from '@angular/platform-browser';
import {HttpClientTestingModule} from '@angular/common/http/testing';


describe('OrgEditComponent', () => {
	let component: OrgEditComponent;
	let fixture: ComponentFixture<OrgEditComponent>;
	let service: OrganisationService;
	let aaService: AdminAreasService;
	let updateForm: (name, url, adminAreas) => void;
	let orgSaveSpy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CommonModule,
				SharedModule,
				NgSelectModule,
				FormsModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				NgxSmartModalModule.forRoot(),
				RouterTestingModule,
				HttpClientTestingModule
			],
			declarations: [
				OrgEditComponent
			],
			providers: [
				FormBuilder,
				OrganisationService,
				AdminAreasService
			],
		})
		.compileComponents();

	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrgEditComponent);
		service = fixture.debugElement.injector.get(OrganisationService);
		aaService = fixture.debugElement.injector.get(AdminAreasService);
		orgSaveSpy = spyOn(service, 'save').and.returnValue(null);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	updateForm = (name, url, adminAreas)  => {
		component.organisationForm.controls.name.setValue(name);
		component.organisationForm.controls.url.setValue(url);
		component.organisationForm.controls.adminAreas.setValue(adminAreas);
	};


	it('should have the default form elements', () => {
		expect(component.organisationForm.controls.name.value).toBeFalsy();
		expect(component.organisationForm.controls.url.value).toBeFalsy();
		expect(component.organisationForm.controls.adminAreas.value).toBeFalsy();
	});

	it('should call save on submit', () => {
		updateForm('org-1', 'http://foo.com', [{atcoCode: 111}]);
		component.onSubmit();
		expect(component.organisationForm.controls.name.valid).toBeTruthy();
		expect(component.organisationForm.controls.url.valid).toBeTruthy();
		expect(component.organisationForm.controls.adminAreas.valid).toBeTruthy();
		expect(orgSaveSpy).toHaveBeenCalled();
	});

	it('should not call submit when url is invalid', () => {
		updateForm('org-1', 'foo', [{atcoCode: 111}]);
		component.onSubmit();
		expect(component.organisationForm.controls.url.invalid).toBeTruthy();
		expect(orgSaveSpy).toHaveBeenCalledTimes(0);
	});

	it('should not call submit when name is not supplied', () => {
		updateForm('', 'http://foo.com', [{atcoCode: 111}]);
		component.onSubmit();
		expect(component.organisationForm.controls.name.invalid).toBeTruthy('Expected name control to be invalid');
		expect(orgSaveSpy).toHaveBeenCalledTimes(0);
	});

	it('should update form controls for the edit case', fakeAsync(() => {
		const viewModel: OrganisationViewModel = {
			id: '1',
			name: 'organisation-1',
			url: 'http://foo.com',
			adminAreas: [{areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222, organisations: null}],
			adminAreasString: 'An area'
		};
		const obs = cold('--a|', {a: viewModel});
		// Listen for value changes on the form and assert values.
		component.organisationForm.valueChanges.subscribe(
			() => {
				expect(component.organisationForm.controls.name.value).toEqual(viewModel.name);
				expect(component.organisationForm.controls.url.value).toEqual(viewModel.url);
				expect(component.organisationForm.controls.adminAreas.value).toEqual(viewModel.adminAreas);
			});
		// Feed a selected organisation via a marble observable
		const spy = spyOnProperty(service, 'selectedOrganisation$').and.returnValue(obs);
		// ngOnInit will make the component subscribe to selectedOrganisation$
		component.ngOnInit();
		expect(spy).toHaveBeenCalled();
		flush();
		fixture.detectChanges();
	}));

	xit('should populate adminAreas dropdown - (skipped cannot fire mousedown)', fakeAsync(() => {
		const adminAreas = {
			name: 'Admin area - 1',
			areaCode: 111,
		};
		const obs = cold('a|', {a: [adminAreas]});
		const spy = spyOn(aaService, 'list').and.returnValue(obs);
		component.ngOnInit();
		tick();
		fixture.detectChanges();

		expect(spy).toHaveBeenCalled();
		spy().subscribe(() => {
			const ngSelectElem = fixture.debugElement.query(By.css('ng-select'));
			ngSelectElem.nativeElement.dispatchEvent(new Event('mousedown'));
		});
	}));

	it('shows banner on server errors', fakeAsync(() => {
		service.errors = 'An error';
		flush();
		fixture.detectChanges();
		const banner = fixture.nativeElement.querySelector('dm-banner');
		expect(banner.childNodes[0].textContent).toEqual('An error');
	}));
});
