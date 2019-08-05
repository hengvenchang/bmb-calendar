import { Component, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, OnInit } from '@angular/core';
import { NavParams, ViewController, Content, InfiniteScroll } from 'ionic-angular';
import { CalendarDay, CalendarMonth, CalendarModalOptions } from '../calendar.model';
import { CalendarService } from '../services/calendar.service';
import * as moment from 'moment';
import { pickModes } from '../config';
import { monthTranslation, translation } from '../translation/translation';
@Component({
  selector: 'ion-calendar-modal',
  template:
    "\n<ion-header style='background-color:rgb(18, 176, 226) !important;'>\n      <ion-navbar text-center style='background-color:rgb(18, 176, 226) !important;' [color]=\"_d.color\">\n\n " +
    "<ion-row class='wrap-content-title'>\n\n" +
    "<ion-col co-2 class='title-icon-left'>\n\n" +
    '</ion-col>\n\n' +
    "<ion-col col-8 class='title-label' >\n\n" +
    "<div class='header-calendar text-ellipsis overflow-ellipsis' style='text-align:center'>{{TranslateText['ChooseDate']}}</div> \n\n" +
    '</ion-col>\n\n' +
    "<ion-col col-2 text-center class='title-icon-right' (click)='closeCalenderModal()'>\n\n" +
    "<ion-icon ios='ios-close' md='ios-close' class='title-icon' style='font-size:45px;margin: -4px 6px'></ion-icon>\n\n" +
    '</ion-col>\n\n' +
    '</ion-row>\n\n' +
    '</ion-navbar>\n\n   ' +
    " <ion-segment mode='md' [(ngModel)]='segment' (ionChange)='onSegmentChange()'>" +
    "<ion-segment-button class='segment-calender' value='startDate'>{{TranslateText['StartDate']}}</ion-segment-button>" +
    "<ion-segment-button class='segment-calender' value='returnDate'>{{TranslateText['ReturnDate']}}</ion-segment-button>" +
    '</ion-segment> ' +
    "<ion-calendar-week [color]='_d.color' [weekArray]='_d.weekdays' [weekStart]='_d.weekStart'>" +
    '</ion-calendar-week>' +
    '</ion-header>\n\n    <ion-content (ionScroll)="onScroll($event)" class="calendar-page"\n ' +
    "[ngClass]=\"{'multi-selection': _d.pickMode === 'multi'}\">\n\n   " +
    '   <div #months>\n      ' +
    ' <ng-template ngFor let-month [ngForOf]="calendarMonths" [ngForTrackBy]="trackByIndex" let-i="index">\n       ' +
    '<div class="month-box" [attr.id]="\'month-\' + i">\n         ' +
    '<h4 class="text-center month-title">{{monthTranslation[month.original.month]}} {{month.original.year}}</h4>\n        ' +
    '<ion-calendar-month [month]="month"\n                                [pickMode]="_d.pickMode"\n             ' +
    '[isSaveHistory]="_d.isSaveHistory"\n                                [id]="_d.id"\n              ' +
    '[color]="_d.color"\n                                (onChange)="onChange($event)"\n             ' +
    '[(ngModel)]="datesTemp">\n\n            </ion-calendar-month>\n          </div>\n      ' +
    '</ng-template>\n\n      </div>\n\n      <ion-infinite-scroll (ionInfinite)="nextMonth($event)">\n     ' +
    '<ion-infinite-scroll-content></ion-infinite-scroll-content>\n   ' +
    '</ion-infinite-scroll>\n\n    </ion-content>\n  ' +
    '<ion-footer (click)=\'oneWayButtonClicked()\' ><div class="content-footer" >' +
    '<button ion-button full clear style="color: white" class="primary-button">' +
    '<p><b>{{TranslateText[buttonTextKey]}}</b></p></button></div>'
})
export class CalendarModal implements OnInit {
  @ViewChild(Content) content: Content;
  @ViewChild('months') monthsEle: ElementRef;

  calendarMonths: Array<CalendarMonth>;
  step: number;
  showYearPicker: boolean;
  year: number;
  years: Array<number>;
  infiniteScroll: InfiniteScroll;
  _s: boolean = true;
  _d: CalendarModalOptions;
  actualFirstTime: number;

  datesTemp: Array<CalendarDay> = [null, null];
  segment = 'startDate';
  startDateValue: any = null;
  returnDateValue: any = null;
  checkStatus: any = true;
  buttonTextKey: any = 'ImTravellingOneWay';
  checkStartDate: any = null;
  firstOpen: any = true;
  firstOpenSetDate: any = true;
  startDateCheck: any = null;
  returnDateCheck: any = null;
  setDefaultDate: any = false;
  startDateDefault: any = null;
  returnDateDefault: any = null;
  TranslateText: any = null;
  monthTranslation: any = null;

  constructor(
    private _renderer: Renderer2,
    public _elementRef: ElementRef,
    public params: NavParams,
    public viewCtrl: ViewController,
    public ref: ChangeDetectorRef,
    public calSvc: CalendarService
  ) {}

  ngOnInit(): void {
    this.init();
    this.initDefaultDate();
  }

  ngAfterViewInit(): void {
    this.findCssClass();
    if (this._d.canBackwardsSelected) this.backwardsMonth();

    this.scrollToDefaultDate();
  }

  init(): void {
    let language = localStorage['lang'] ? localStorage['lang'] : 'en';
    this.TranslateText = translation[language];
    this.monthTranslation = monthTranslation[language];
    let segmentActive = this.params.get('options');
    if (this.firstOpen === true) {
      this.segment = segmentActive.title;
      this.firstOpen = false;
    }

    let checkTo = new Date(this.params.data.options.to);
    let checkYearTo = checkTo.getFullYear();
    if (checkYearTo < 2018) {
      this.params.data.options.to = 0;
    }
    this._d = this.calSvc.safeOpt(this.params.get('options'));
    this._d.showAdjacentMonthDay = false;

    if (this.segment == 'startDate') {
      this._d.defaultScrollTo = new Date(this.params.data.options.startDate);
    }
    this.step = this._d.step;
    if (this.step < 1) {
      this.step = 1;
    }
    this.calendarMonths = this.calSvc.createMonthsByPeriod(
      moment(this._d.from).valueOf(),
      this.findInitMonthNumber(this._d.defaultScrollTo) + this.step,
      this._d
    );
  }

  initDefaultDate(): void {
    const { pickMode, defaultDate, defaultDateRange, defaultDates } = this._d;
    switch (pickMode) {
      case pickModes.SINGLE:
        if (defaultDate) {
          this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDate), this._d);
        }
        break;
      case pickModes.RANGE:
        if (defaultDateRange) {
          if (defaultDateRange.from) {
            this.datesTemp[0] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.from), this._d);
          }
          if (defaultDateRange.to) {
            this.datesTemp[1] = this.calSvc.createCalendarDay(this._getDayTime(defaultDateRange.to), this._d);
          }
        }
        break;
      case pickModes.MULTI:
        if (defaultDates && defaultDates.length) {
          this.datesTemp = defaultDates.map(e => this.calSvc.createCalendarDay(this._getDayTime(e), this._d));
        }
        break;
      default:
        this.datesTemp = [null, null];
    }
  }

  findCssClass(): void {
    let { cssClass } = this._d;
    if (cssClass) {
      cssClass.split(' ').forEach((_class: string) => {
        if (_class.trim() !== '') this._renderer.addClass(this._elementRef.nativeElement, _class);
      });
    }
  }

  onChange(data: any): void {
    delete this.params.data.options.defaultDateRange;
    var _a = this._d,
      pickMode = _a.pickMode,
      autoDone = _a.autoDone;
    if (this.segment === 'startDate' && this.returnDateCheck === null) {
      this.checkStartDate = data[0];
      _a.pickMode = pickModes.SINGLE;
      data[1] = null;
      this.checkStatus = false;
      this.buttonTextKey = 'ImTravellingOneWay';
      this.firstOpenSetDate = false;
    } else if (this.segment === 'startDate' && this.returnDateCheck !== null) {
      _a.pickMode = pickModes.RANGE;

      let tt = data;
      if (this.returnDateCheck.time === undefined) {
        data[1] = this.calSvc.createCalendarDay(this._getDayTime(this.returnDateCheck), this._d);
      } else {
        data[1] = this.returnDateCheck;
      }
      this.buttonTextKey = 'ImTravellingWithReturnTrip';
      data[0] = tt[0];
      this.checkStartDate = data[0];
      this.checkStatus = false;
    }
    if (this.segment === 'returnDate') {
      this.buttonTextKey = 'ImTravellingWithReturnTrip';
      _a.pickMode = pickModes.RANGE;
      pickMode = _a.pickMode;
      let t = [];
      if (this.checkStartDate.time === undefined) {
        t[0] = this.calSvc.createCalendarDay(this._getDayTime(this.checkStartDate), this._d);
      } else {
        t[0] = this.checkStartDate;
      }
      if (this.firstOpenSetDate === true) {
        let g = new Date(this.params.data.options.startDate);
        let f = this.calSvc.createCalendarDay(this._getDayTime(g), this._d);
        t[0] = f;
        this.firstOpenSetDate = false;
        this.checkStatus = false;
      }
      if (data[1] !== null) {
        t[1] = data[1];
      } else {
        t[1] = data[0];
      }
      this.returnDateCheck = t[1];
      data = t;
    }
    this.datesTemp = data;
    this.ref.detectChanges();
    if (pickMode !== pickModes.MULTI && autoDone && this.canDone()) {
      this.done();
    }
  }

  onCancel(): void {
    this.viewCtrl.dismiss(null, 'cancel');
  }

  done(): void {
    let data = {
      startDate: this.startDateValue,
      returnDate: this.returnDateValue
    };
    this.viewCtrl.dismiss(data, 'done');
  }

  canDone(): boolean {
    if (!Array.isArray(this.datesTemp)) {
      return false;
    }
    const { pickMode } = this._d;

    switch (pickMode) {
      case pickModes.SINGLE:
        return !!(this.datesTemp[0] && this.datesTemp[0].time);
      case pickModes.RANGE:
        return !!(this.datesTemp[0] && this.datesTemp[1]) && !!(this.datesTemp[0].time && this.datesTemp[1].time);
      case pickModes.MULTI:
        return this.datesTemp.length > 0 && this.datesTemp.every(e => !!e && !!e.time);
      default:
        return false;
    }
  }

  nextMonth(infiniteScroll: InfiniteScroll): void {
    this.infiniteScroll = infiniteScroll;
    let len = this.calendarMonths.length;
    let final = this.calendarMonths[len - 1];
    let nextTime = moment(final.original.time)
      .add(1, 'M')
      .valueOf();
    let rangeEnd = this._d.to ? moment(this._d.to).subtract(1, 'M') : 0;

    if (len <= 0 || (rangeEnd !== 0 && moment(final.original.time).isAfter(rangeEnd))) {
      infiniteScroll.enable(false);
      return;
    }

    this.calendarMonths.push(...this.calSvc.createMonthsByPeriod(nextTime, 1, this._d));
    infiniteScroll.complete();
  }

  backwardsMonth(): void {
    let first = this.calendarMonths[0];
    if (first.original.time <= 0) {
      this._d.canBackwardsSelected = false;
      return;
    }
    let firstTime = (this.actualFirstTime = moment(first.original.time)
      .subtract(1, 'M')
      .valueOf());
    this.calendarMonths.unshift(...this.calSvc.createMonthsByPeriod(firstTime, 1, this._d));
    this.ref.detectChanges();
  }

  scrollToDate(date: Date): void {
    let defaultDateIndex = this.findInitMonthNumber(date);
    let monthElement = this.monthsEle.nativeElement.children[`month-${defaultDateIndex}`];
    let defaultDateMonth = monthElement ? monthElement.offsetTop : 0;

    if (defaultDateIndex === -1 || defaultDateMonth === 0) return;
    setTimeout(() => {
      this.content.scrollTo(0, defaultDateMonth, 128);
    }, 300);
  }

  scrollToDefaultDate(): void {
    this.scrollToDate(this._d.defaultScrollTo);
  }

  onScroll($event: any): void {
    if (!this._d.canBackwardsSelected) return;
    if ($event.scrollTop <= 200 && $event.directionY === 'up' && this._s) {
      this._s = !1;
      let lastHeight = this.content.getContentDimensions().scrollHeight;
      setTimeout(() => {
        this.backwardsMonth();
        let nowHeight = this.content.getContentDimensions().scrollHeight;
        this.content.scrollTo(0, nowHeight - lastHeight, 0).then(() => {
          this._s = !0;
        });
      }, 180);
    }
  }

  findInitMonthNumber(date: Date): number {
    let startDate = this.actualFirstTime ? moment(this.actualFirstTime) : moment(this._d.from);
    let defaultScrollTo = moment(date);
    const isAfter: boolean = defaultScrollTo.isAfter(startDate);
    if (!isAfter) return -1;

    if (this.showYearPicker) {
      startDate = moment(new Date(this.year, 0, 1));
    }

    return defaultScrollTo.diff(startDate, 'month');
  }

  _getDayTime(date: any): number {
    return moment(moment(date).format('YYYY-MM-DD')).valueOf();
  }

  _monthFormat(date: any): string {
    return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'));
  }

  trackByIndex(index: number, moment: CalendarMonth): number {
    return moment.original ? moment.original.time : index;
  }

  closeCalenderModal(): void {
    this.viewCtrl.dismiss(null, 'cancel');
  }
  ionViewDidLoad(): any {
    this.findCssClass();
    this.scrollToDefaultDate();
    if (this.setDefaultDate === false) {
      let sDate = this.params.data.options.startDate;
      let rDate = this.params.data.options.returnDate;
      if (sDate !== undefined) {
        this.checkStartDate = sDate;
        this.startDateDefault = sDate;
      }
      if (rDate !== undefined) {
        this.returnDateCheck = rDate;
        this.returnDateDefault = rDate;
      }
      this.setDefaultDate = true;
      this.initDefaultDate();
    }
    if (this.segment == 'startDate') {
      if (this.params.data.options.returnDate !== undefined) {
        this.returnDateCheck = this.params.data.options.returnDate;
        let d = new Date(this.params.data.options.returnDate);
        this.params.data.options.to = d;
        this._d.to = d;
        this.init();
        this.initDefaultDate();
      }
      this.init();
      this.initDefaultDate();
    }
    if (this.segment == 'returnDate') {
      if (this.params.data.options.startDate !== null) {
        this.checkStartDate = this.params.data.options.startDate;
        let d = new Date(this.params.data.options.startDate);
        this.params.data.options.from = d;
        this._d.from = d;
        this.init();
        this.initDefaultDate();
      }
      if (this.params.data.options.defaultreturnDate == null) {
        this.buttonTextKey = 'ImTravellingOneWay';
      } else {
        this.buttonTextKey = 'ImTravellingWithReturnTrip';
      }
    }
  }

  oneWayButtonClicked = function() {
    let tempStart = null;
    let tempReturn = null;
    if (this.datesTemp[1] === null) {
      tempStart = this.calSvc.wrapResult(this.datesTemp, pickModes.SINGLE);
      this.datesTemp.oneWayTravelling = true;
    } else {
      tempStart = this.calSvc.wrapResult(this.datesTemp, pickModes.MULTI);
      tempReturn = this.calSvc.wrapResult(this.datesTemp, pickModes.MULTI);
      this.datesTemp.oneWayTravelling = false;
    }

    this.datesTemp.startDate = tempStart;
    this.datesTemp.returnDate = tempReturn;
    this.viewCtrl.dismiss(this.datesTemp, 'done');
  };

  onSegmentChange(): void {
    let fromDate;
    let toDate;
    if (this.segment == 'startDate') {
      if (this.returnDateCheck !== null) {
        if (this.returnDateCheck.time !== undefined) {
          toDate = new Date(this.returnDateCheck.time);
        } else {
          toDate = new Date(this.returnDateCheck);
        }
        this.params.data.options.to = toDate;
        this._d.to = toDate;
        this.params.data.options.pickMode = pickModes.RANGE;
        this._d.pickMode = pickModes.RANGE;
        this._d.defaultDateRange = { to: this.returnDateCheck };
        this.params.data.options.defaultDateRange = { to: this.returnDateCheck };
      } else {
        fromDate = new Date();
      }
    }

    if (this.segment == 'returnDate') {
      this.params.data.options.pickMode = pickModes.RANGE;
      this._d.pickMode = pickModes.RANGE;
      if (this.checkStartDate !== null) {
        if (this.checkStartDate.time !== undefined) {
          fromDate = new Date(this.checkStartDate.time);
        } else {
          fromDate = new Date(this.checkStartDate);
        }
      }
      //delet to cuz we want to show more date to select
      delete this.params.data.options.to;
      delete this._d.to;
    }
    this.params.data.options.from = fromDate;
    this._d.from = fromDate;
    this._d.defaultDateRange = { from: fromDate };
    this.params.data.options.defaultDateRange = { from: fromDate };
    this._d.defaultDateRange = { to: toDate };
    this.params.data.options.defaultDateRange = { to: toDate };
    this.init();
    this.initDefaultDate();
  }
}
