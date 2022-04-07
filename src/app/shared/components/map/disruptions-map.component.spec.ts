import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { DisruptionsMapComponent } from './disruptions-map.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { By } from '@angular/platform-browser';
import { mapData } from './disruptions-map.testdata';
import { FeatureCollection } from './disruptions-map.geojson.classes';
import { LngLatBounds, LngLat } from 'mapbox-gl';
import { DisruptionsListModule } from '../../../disruptions-list/disruptions-list.module';
import { SharedModule } from '../../shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DisruptionsMapComponent', () => {
	let component: DisruptionsMapComponent;
	let fixture: ComponentFixture<DisruptionsMapComponent>;
	let mglMap;
	let mapComponent;
	let mapboxInstance;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [
				NgxMapboxGLModule.withConfig({
					accessToken: environment.mapbox.accessToken
				}),
				ApolloTestingModule,
				DisruptionsListModule,
				SharedModule,
				HttpClientTestingModule
			],
			providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionsMapComponent);
		fixture.autoDetectChanges();
		component = fixture.debugElement.componentInstance;
		mglMap = fixture.debugElement.query(By.css('mgl-map'));
		mapComponent = mglMap.componentInstance;

		// Due to the map running it its own zone, the onLoad event never makes it to the component. Fire it manually here.
		component.data = mapData as FeatureCollection;
		/// component.iconsLoaded = 4;
		fixture.detectChanges();

		mapboxInstance = mapComponent.MapService.mapInstance;
		component.onLoad(mapboxInstance);
	});

	// Although this passes it causes a log of console errors and logs an error:
	// Error: The user aborted a request.
	xit('has map component', () => {
		expect(component.map).toBeTruthy();
	});

	// Although this passes it causes a log of console errors and logs an error:
	// Error: The user aborted a request.
	xit('has correct centre', () => {
		const bounds = component.map.getCenter() as LngLat;
		expect(bounds).toEqual(new LngLat(-1.0873, 53.96));
	});

	// Although this passes it causes a log of console errors and logs an error:
	// Error: The user aborted a request.
	xit('has correct bounds (skipped because the bound values depend on the container size which depends on the browser size)', () => {
		const bounds = component.map.getBounds() as LngLatBounds;
		expect(bounds).toEqual(
			new LngLatBounds([-1.8906752441384356, 53.83862740479779, -0.28392475585809507, 54.081020258862594])
		);
	});
});
