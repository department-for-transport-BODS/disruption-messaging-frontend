# DisruptionMessaging

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4210/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Writing unit tests

The standard Angular documentation is excellent - read it end to end before attempting to write any tests.
See https://angular.io/guide/testing

Here are a few best practices.

### Mocking services for components

Say your component gets data from backend using the service. You would ideally test the service code
in the service tests not in the component tests. The component tests would test how the HTML is rendered.

In order to mock out the service function, it's best to get the service using the component's injector.
So instead of ```Testbed.get(UsersService)``` use ```fixture.debugElement.injector.get(UsersService);```
to guarantee that you are mocking out the function or property of the injected service.

### Mocking functions that return observables
jasmine-marbles are used to mock observables. Say a function returns an observable and your component
depends on that function. The following code demonstrates how to use jasmine marbes
```angular2
it('a demo test', () =>
	const obs = cold('--a|', { a: {mydata: null}});
	const spy = spyOnProperty(service, 'selectedUser$').and.returnValue(obs);

	component.ngOnInit(); // Subscribes to selectedUser$
	getTestScheduler().flush(); // flush the observables
	expect(spy).toHaveBeenCalled();
	
	fixture.detectChanges();
	// Here the HTML depending on the above data should we available.
	// Do all asserts here.
)};
```

* *Note* that fakeAsync isn't used above as jasmine marbles runs the observables in its own
test scheduler. You might come across code that uses fakeAsync with ```flush()``` which does work but
not in all circumstances. Use ```getTestScheduler.flush()``` instead.

* For testing async code
 * Either use getTestSchedule.flush() __without fakeAsync__.
 * Or use rxjs defer to defer promises with fakeAsync

#### When using async pipe in templates.
When using async pipe syntax in templates, if the observable is a property, then write data to it instead of using jasmine marbles
or in case of using jasmine marbles, subscribe to the observable in the test and assert inside the subscription.

* Example without jasmine marbles.

```html
<div *ngIf="service.serverResponse$"></div>
```
```angular2
	get serverResponse$() {
		this.serverResponseSubject.asObservable();
	};
	
	set serverResponse$(response) {
		this.serverResponseSubject.next(response);
	};
```

Now if you want to assert elements within the HTML div, the test would look like

```angular2
it('should populate div', () => {
	const service = fixture.debugElement.injector.get(TestService)
	service.serverResponse$ = 'A response';
	getTestScheduler.flush();
	fixture.detectChanges();
	// You asserts on HTML elements that are now generated inside that div goes here.
}
```

### Calling fixture.detectChanges() too many times?
You can avoid this by adding the following to providers when configuring the testing module 
```angular2
providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
```

### Running selected tests

Using ```fdescribe``` will run only that test suite and using ```fit``` will run a specific test in that suite.


#### Testing reactive forms

- Do not forget to import ReactiveFormsModule in imports.
- Run tests in fakeAsync zone and use tick() after updating an input value.
- To update an input value
```angular2
	const text = fixture.debugElement.query(By.css('#message-text-0'));
	text.nativeElement.value = 'shit';
	text.nativeElement.dispatchEvent(new Event('input'));

	tick();
	fixture.detectChanges();
	console.log(fixture.nativeElement);
```
- Note that if there is a debounce time inside the component before input is updated,
then use ```tick(<time to wait>)```.
## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
