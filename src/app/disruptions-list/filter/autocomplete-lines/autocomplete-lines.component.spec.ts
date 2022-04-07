import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteLinesComponent } from './autocomplete-lines.component';
import { LinesListService } from './lines-list.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('AutocompleteLinesComponent', () => {
	let component: AutocompleteLinesComponent;
	let fixture: ComponentFixture<AutocompleteLinesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AutocompleteLinesComponent],
			providers: [LinesListService],
			imports: [NgSelectModule, FormsModule, ApolloTestingModule]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteLinesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
