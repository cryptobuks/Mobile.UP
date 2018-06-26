import { TranslateService } from '@ngx-translate/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { IConfig, INewsApiResponse } from './../../library/interfaces';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  isLoaded = false;

  eventsList;
  todaysEventsList = [];
  nextEventsList = [];

  locationsList = [];
  todaysLocationsList = [];

  eventLocation = "0";
  timespan = 0;

  eventsToday = false;
  eventsNext = [];

  firstEventTodayForLocation = [];
  firstEventForLocation = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private http: HttpClient, private translate: TranslateService) {
  }

  async ngOnInit() {

    this.todaysLocationsList.push(this.translate.instant("page.events.noEventCategory"));

    let config: IConfig = await this.storage.get("config");

    let headers: HttpHeaders = new HttpHeaders()
      .append("Authorization", config.webservices.apiToken);

    var url = config.webservices.endpoint.events;
    this.http.get(url, {headers:headers}).subscribe((response:INewsApiResponse) => {
      if (response.errors.exist == false) {
        this.eventsList = response.vars.events;

        var i;
        for (var loc in response.vars.places) {
          for (i = 0; i < this.eventsList.length; i++) {
            // check if there are events for location
            // hide locations with zero events
            if (response.vars.places[loc] == this.eventsList[i].Place.name) {
              this.locationsList.push(response.vars.places[loc]);
              break;
            }
          }
        }
        for (i = 0; i < this.eventsList.length; i++) {
          this.checkTodaysEvents(this.eventsList[i]);
        }
        this.checkNextEvents();
        this.initSeperators();
        this.isLoaded = true;
      }
    })

  }

  initSeperators() {
    var i,j;
    var tmpCounter = [];
    for (i = 0; i < this.todaysLocationsList.length; i++) {
      tmpCounter[i] = 0;
      for (j = 0; j < this.todaysEventsList.length; j++) {
        if (this.todaysLocationsList[i] == this.todaysEventsList[j].Place.name) {
          if (tmpCounter[i] == 0) {
            tmpCounter [i] = 1;
            this.firstEventTodayForLocation[j] = true;
          } else {
            this.firstEventTodayForLocation[j] = false;
          }
        }
      }
    }
    
    for (i = 0; i < this.locationsList.length; i++) {
      tmpCounter[i] = 0;
      for (j = 0; j < this.nextEventsList.length; j++) {
        if (this.locationsList[i] == this.nextEventsList[j].Place.name) {
          if (tmpCounter[i] == 0) {
            tmpCounter[i] = 1;
            this.firstEventForLocation[j] = true;
          } else {
            this.firstEventForLocation[j] = false;
          }
        }
      }
    }
  }

  checkTodaysEvents(event) {
    var timeBegin = moment(event.Event.startTime * 1000);
    var currentTime = moment();
    var isToday = currentTime.isSame(timeBegin, "day");

    if (isToday) {
      this.todaysEventsList.push(event);
      this.eventsToday = true;

      var i;
      var alreadyAdded = false;

      for (i = 0; i < this.todaysLocationsList.length; i++) {
        if (this.todaysLocationsList[0] == this.translate.instant("page.events.noEventCategory")) {
          this.todaysLocationsList[0] = event.Place.name;
          alreadyAdded = true;
        } else if (this.todaysLocationsList[i] == event.Place.name) {
          alreadyAdded = true;
        }
      }

      if (!alreadyAdded) {
        this.todaysLocationsList.push(event.Place.name);
      }

    }
  }

  checkNextEvents() {

    var i,j;
    var tmpCounter = [];
    for (i = 0; i < this.locationsList.length; i++) {
        tmpCounter[i] = 0;
        for (j = 0; j < this.eventsList.length; j++) {
          if (this.eventsList[j].Place.name == this.locationsList[i]) {
            if (tmpCounter[i] < 3) {
              this.nextEventsList.push(this.eventsList[j]);
              tmpCounter[i] = tmpCounter[i] + 1;
            }
          }
        }
    }

  }

  setLocation(i) {
    this.eventLocation = i;
  }

  setTimespan(i) {
    this.eventLocation = "0";
    this.timespan = i;
  }

  isActive(i) {
    if (this.eventLocation == i) {
      return "primary"
    } else {
      return "secondary"
    }
  }

  isActiveTimespan(i) {
    if (this.timespan == i) {
      return "primary"
    } else {
      return "secondary"
    }
  }

}