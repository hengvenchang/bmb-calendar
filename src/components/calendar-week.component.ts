import { Component, Input } from '@angular/core';
import { Week } from '../translation/translation';
import { defaults } from '../config';
@Component({
  selector: 'ion-calendar-week',
  template: `
    <ion-toolbar class="week-toolbar" no-border-top>
      <ul [class]="'week-title ' + color">
        <li *ngFor="let w of _displayWeekArray; let i = index" [id]="'day-title-' + i">{{ w }}</li>
      </ul>
    </ion-toolbar>
  `
})
export class CalendarWeekComponent {
  _weekArray: string[] = [];
  _displayWeekArray: string[] = this._weekArray;
  _weekStart: number = 0;
  @Input() color: string = defaults.COLOR;

  constructor() {
    this.setWeek();
  }

  @Input()
  set weekArray(value: string[]) {
    if (value && value.length === 7) {
      this._weekArray = [...value];
      this.adjustSort();
    }
  }

  @Input()
  set weekStart(value: number) {
    if (value === 0 || value === 1) {
      this._weekStart = value;
      this.adjustSort();
    }
  }

  adjustSort(): void {
    this.setWeek();
    if (this._weekStart === 1) {
      let cacheWeekArray = [...this._weekArray];
      cacheWeekArray.push(cacheWeekArray.shift());
      this._displayWeekArray = [...cacheWeekArray];
    } else if (this._weekStart === 0) {
      this._displayWeekArray = [...this._weekArray];
    }
  }

  setWeek() {
    let language = localStorage['lang'] ? localStorage['lang'] : 'en';
    this._weekArray = Week[language];
  }
}
