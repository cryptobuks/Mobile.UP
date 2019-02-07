import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IPulsAPIResponse_getLectureScheduleAll} from "../../library/interfaces_PULS";
import { IConfig } from '../../library/interfaces';
import { Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { SessionProvider } from '../../providers/session/session';
import { ConnectionProvider } from "../../providers/connection/connection";
import { PulsProvider } from "../../providers/puls/puls";
import { Observable } from 'rxjs';


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
    private storage: Storage,
    private cache: CacheService,
    private platform: Platform,
    private keyboard: Keyboard,
    private http: HttpClient,
    private sessionProvider: SessionProvider,
    private connection: ConnectionProvider,
    private puls:PulsProvider) {
  }

  ngOnInit() {
    this.connection.checkOnline(true, true);
    this.loadLectureSchedule();
  }

  async loadLectureSchedule(refresher?) {

    let session = JSON.parse(await this.sessionProvider.getSession());

    if (refresher) {
      this.cache.removeItem("lectureScheduleAll");
    } else {
      this.isLoaded = false;
    }

    this.cache.loadFromObservable("lectureScheduleAll", Observable.of(this.puls.getLectureScheduleAll().subscribe(
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
