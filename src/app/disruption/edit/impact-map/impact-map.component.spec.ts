import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ImpactMapComponent } from './impact-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../../../../environments/environment';
import { SharedModule } from '../../../shared/shared.module';
import { ImpactMapService } from './impact-map.service';
import { Map } from 'mapbox-gl';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { linesGeoJson } from './impact-map.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
import { ITransModelAdminAreaListType } from '../../../../generated/graphql';
import { TransModelStore } from '../../../shared/components/transport-data/transmodel.store';
import { LngLatBounds } from 'mapbox-gl';

describe('ImpactMapComponent', () => {
	let component: ImpactMapComponent;
	let fixture: ComponentFixture<ImpactMapComponent>;
	let service: ImpactMapService;
	let transModelStore: TransModelStore;
	let controller: ApolloTestingController;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImpactMapComponent],
			imports: [
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				SharedModule,
				HttpClientTestingModule,
				NgxSpinnerModule,
				NgxSmartModalModule.forRoot(),
				ApolloTestingModule,
				HttpClientTestingModule,
				RouterTestingModule
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImpactMapComponent);
		service = fixture.debugElement.injector.get(ImpactMapService);
		transModelStore = fixture.debugElement.injector.get(TransModelStore);
		component = fixture.componentInstance;
		controller = TestBed.get(ApolloTestingController);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('centers on admin area', fakeAsync(() => {
		const adminAreasList: ITransModelAdminAreaListType[] = [{
			name: 'My admin area',
			atcoCode: '22',
			entityId: 'AA022',
			boundingBox: '46823,46850,47823,47850',
			featureName: 'MyAdminArea',
			codePrefix: 'AA',
			shortName: 'My'
		}, {
			name: 'My admin area - 2',
			atcoCode: '24',
			entityId: 'AA025',
			boundingBox: '46623,46850,47823,47854',
			featureName: 'MyAdminArea - 2',
			codePrefix: 'AA',
			shortName: 'My2'
		}];
		component.map = new Map({
			container: 'impact-map-container',
			style: 'mapbox://styles/ito-mapbox/cjxpzx0vh02vk1clb89qxbw3n',
			center: [-74.50, 40],
			zoom: 9
		});

		transModelStore.getAdminAreas();

		controller.expectOne('adminAreas').flush({
			data: {adminAreas: adminAreasList}
		});
		controller.verify();
		flush();

		// Now read the admin areas.
		component.ngOnInit();
		flush();
		expect(component.boundingBox).toEqual(new LngLatBounds(
			[-6.955343435084088, 50.215817884516945, -6.939514548508321, 50.22552893787189]));
	}));

	it('calculate bounding box based on data', () => {
		const map = new Map({
			container: 'impact-map-container',
			style: 'mapbox://styles/ito-mapbox/cjxpzx0vh02vk1clb89qxbw3n',
			center: [-74.50, 40],
			zoom: 9
		});
		const bbSpy = spyOn(map, 'fitBounds').and.callThrough();
		const zoomObs = cold('a|', {a: 'line'});
		spyOnProperty(service, 'changeZoom$').and.returnValue(zoomObs);
		getTestScheduler().flush();

		component.impactType = 1;
		component.onLoad(map);
		component.lines = linesGeoJson;
		service.changeZoom$.subscribe(() => {
			fixture.detectChanges();
			expect(bbSpy).toHaveBeenCalled();
			expect(bbSpy).toHaveBeenCalledWith([[0, 1], [1, 2]], {padding: 25, animate: true, maxZoom: component.maxAutoZoom});
		});
	});

	it('should call service selectAll when select all is clicked.', () => {
		const spy = spyOn(service, 'selectAll');
		component.toggleSelectAll();
		expect(spy).toHaveBeenCalled();
	});

	it('should call service deSelectAll when deselect all is clicked.', () => {
		const spy = spyOn(service, 'deSelectAll');
		component.selectAll = true;
		component.toggleSelectAll();
		expect(spy).toHaveBeenCalled();
	});
});
