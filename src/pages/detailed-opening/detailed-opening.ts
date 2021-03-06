import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-detailed-opening',
  templateUrl: 'detailed-opening.html',
})
export class DetailedOpeningPage {

  item;
  parsedOpening;
  intervals = [];
  every_week_is_same;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translate: TranslateService) {
    this.item = this.navParams.data.item;
    this.parsedOpening = this.navParams.data.parsed;
  }

  ionViewDidLoad() {
    this.getOpenTimes();
  }

  shortenLink(link:string) {
    if (link.length > 30) {
      return link.substr(0, 30) + "..."
    } else { return link }
  }

  openUntil() {
    var from = new Date();
    var to = new Date();
    to.setDate(to.getDate() + 6);
    to.setHours(23,59,59,999);
    let willClose: Date = this.parsedOpening.getNextChange(from, to);

    if (willClose) {
      if (this.isToday(willClose)) {
        return this.translate.instant("page.openingHours.closes") + this.addZero(willClose.getHours()) + ":" + this.addZero(willClose.getMinutes()) + this.translate.instant("page.openingHours.time");
      } else {
        return this.translate.instant("page.openingHours.closes") + this.weekday(willClose.getDay()) + " " + this.addZero(willClose.getHours()) + ":" + this.addZero(willClose.getMinutes()) + this.translate.instant("page.openingHours.time");
      }
    } else {
      return "";
    }
  }

  closedUntil() {
    var from = new Date();
    var to = new Date();
    to.setDate(to.getDate() + 6);
    to.setHours(23,59,59,999);
    let willChange: Date = this.parsedOpening.getNextChange(from, to);

    if (willChange) {
      if (this.isToday(willChange)) {
        return this.translate.instant("page.openingHours.opens") + this.addZero(willChange.getHours()) + ":" + this.addZero(willChange.getMinutes()) + this.translate.instant("page.openingHours.time");
      } else {
        return this.translate.instant("page.openingHours.opens") + this.weekday(willChange.getDay()) + " " + this.addZero(willChange.getHours()) + ":" + this.addZero(willChange.getMinutes()) + this.translate.instant("page.openingHours.time");
      }
    } else {
      if (this.parsedOpening.getComment() != null) {
        if (this.translate.currentLang == "en" && this.parsedOpening.getComment() == "nach Vereinbarung") {
          return "by appointment only";
        } else if (this.parsedOpening.getComment() == "nach Vereinbarung") {
          return this.parsedOpening.getComment();
        } else {
          return "";
        }
      } else {
        return "";
      }
    }
  }

   isToday(td) {
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
  }

  addZero(i) {
    if (i < 10) {
      i = "0"+i;
    }
    return i;
  }

  weekday(i) {
    let weekday = [];
    if (this.translate.currentLang == "de") {
      weekday[0] = "So.";
      weekday[1] = "Mo.";
      weekday[2] = "Di.";
      weekday[3] = "Mi.";
      weekday[4] = "Do.";
      weekday[5] = "Fr.";
      weekday[6] = "Sa.";
    } else {
      weekday[0] = "Su.";
      weekday[1] = "Mo.";
      weekday[2] = "Tu.";
      weekday[3] = "We.";
      weekday[4] = "Th.";
      weekday[5] = "Fr.";
      weekday[6] = "Sa.";
    }
    return weekday[i];
  }

  getOpenTimes() {
    var from = new Date();
    var to = new Date();
    from.setHours(0,0,0,0);
    to.setDate(to.getDate() + 6);
    to.setHours(23,59,59,999);

    this.intervals = this.parsedOpening.getOpenIntervals(from, to);
    
    this.every_week_is_same = this.parsedOpening.isWeekStable();
  }
  
  parseDate(from:Date, to:Date) {
    return this.addZero(from.getHours()) + ":" + this.addZero(from.getMinutes()) + this.translate.instant("page.openingHours.time") + " - " + this.addZero(to.getHours()) + ":" + this.addZero(to.getMinutes()) + this.translate.instant("page.openingHours.time")
  }

}
