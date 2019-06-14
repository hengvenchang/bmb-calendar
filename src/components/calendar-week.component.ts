import { Component, Input } from '@angular/core';
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
  _weekArray: string[] = defaults.WEEKS_FORMAT;
  _displayWeekArray: string[] = this._weekArray;
  _weekStart: number = 0;
  @Input() color: string = defaults.COLOR;

  constructor() {
    this._weekArray = defaults.WEEKS_FORMAT;
    var lang = localStorage['lang'];
    if (lang == 'kh') {
      this._weekArray = defaults.WEEKS_FORMAT_KH;
    }
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
    this._weekArray = defaults.WEEKS_FORMAT;
    var lang = localStorage['lang'];
    if (lang == 'kh') {
      this._weekArray = defaults.WEEKS_FORMAT_KH;
    }
    if (this._weekStart === 1) {
      let cacheWeekArray = [...this._weekArray];
      cacheWeekArray.push(cacheWeekArray.shift());
      this._displayWeekArray = [...cacheWeekArray];
    } else if (this._weekStart === 0) {
      this._displayWeekArray = [...this._weekArray];
    }
  }
}
