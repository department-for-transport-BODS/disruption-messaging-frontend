// Copied useful helpers from https://github.com/ng-select/ng-select/blob/master/src/ng-select/testing/helpers.ts to work with ng-select dropdowns.
import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { getTestScheduler } from 'jasmine-marbles/src/scheduler';

export class TestsErrorHandler { }

export enum KeyCode {
    Tab = 9,
    Enter = 13,
    Esc = 27,
    Space = 32,
    ArrowUp = 38,
    ArrowDown = 40,
    Backspace = 8,
    at = 192
}

export function tickAndDetectChanges(fixture: ComponentFixture<any>) {
    fixture.detectChanges();
    tick();
}

export function flushTickAndDetectChanges(fixture: ComponentFixture<any>) {
    getTestScheduler().flush();
    tick(500);
    fixture.detectChanges();
}

export function selectOption(fixture, key: KeyCode, index: number) {
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Space); // open
    tickAndDetectChanges(fixture); // need to tick and detect changes, since dropdown fully inits after promise is resolved
    for (let i = 0; i < index; i++) {
        triggerKeyDownEvent(getNgSelectElement(fixture), key);
    }
    triggerKeyDownEvent(getNgSelectElement(fixture), KeyCode.Enter); // select
}

export function getNgSelectElement(fixture: ComponentFixture<any>): DebugElement {
    return fixture.debugElement.query(By.css('ng-select'));
}

export function triggerKeyDownEvent(element: DebugElement, which: number, key = ''): void {
    element.triggerEventHandler('keydown', {
        which: which,
        key: key,
        preventDefault: () => { },
    });
}