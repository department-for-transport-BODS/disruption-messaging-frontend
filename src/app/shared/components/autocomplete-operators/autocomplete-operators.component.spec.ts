import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteOperatorsComponent } from './autocomplete-operators.component';
import { OperatorsListService } from './operators-list.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('AutocompleteOperatorsComponent', () => {
	let component: AutocompleteOperatorsComponent;
	let fixture: ComponentFixture<AutocompleteOperatorsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AutocompleteOperatorsComponent],
			providers: [OperatorsListService],
			imports: [NgSelectModule, FormsModule, ApolloTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteOperatorsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
