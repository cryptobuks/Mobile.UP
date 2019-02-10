import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CacheService } from 'ionic-cache';
import { IPulsAPIResponse_getLectureScheduleAll} from "../../library/interfaces_PULS";
import { Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ConnectionProvider } from "../../providers/connection/connection";
import { PulsProvider } from "../../providers/puls/puls";
import { of } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-lecture-schedule',
  templateUrl: 'lecture-schedule.html',
})
export class LectureSchedulePage {

  isLoaded;
  allLectures;
  lectures;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private cache: CacheService,
    private platform: Platform,
    private keyboard: Keyboard,
    private connection: ConnectionProvider,
    private puls:PulsProvider) {
  }

  ngOnInit() {
    this.connection.checkOnline(true, true);
    this.loadLectureSchedule();
  }

  async loadLectureSchedule(refresher?) {

    if (refresher) {
      this.cache.removeItem("lectureScheduleAll");
    } else {
      this.isLoaded = false;
    }

    this.cache.loadFromObservable("lectureScheduleAll", of(this.puls.getLectureScheduleAll().subscribe(
      (response:IPulsAPIResponse_getLectureScheduleAll) => {
      if (refresher) {
        refresher.complete();
      }
      console.log(response);
      this.allLectures = response;
      this.lectures = this.allLectures;

      this.isLoaded = true;
    })));
  }

  // hides keyboard once the user is scrolling
  onScrollListener() {
    if (this.platform.is("cordova") && (this.platform.is("ios") || this.platform.is("android"))) {
      this.keyboard.hide();
    }
  }
}
