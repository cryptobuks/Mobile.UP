import {Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IWebServices } from "../../library/interfaces";
import {Storage} from "@ionic/storage";
import {ISession} from "../../providers/login-provider/interfaces";
import {Observable} from "rxjs/Observable";
import {
  IPulsAPIResponse_getStudentCourses,
  IPulsApiRequest_getStudentCourses
} from "../../library/interfaces_PULS";
import {LoginPage} from "../login/login";
import {createEventSource,} from "./createEvents";
import {TranslateService} from "@ngx-translate/core";
import {NgCalendarModule} from "ionic2-calendar";


function debug(text){
  console.log(`[TimetablePage]: ${text}`);
}

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {

  eventSource = [];

  calendarOptions = {
    calendarMode: "week",
    currentDate: new Date()
  };


  constructor(
      public navCtrl: NavController,
      private http:HttpClient,
      private storage:Storage,
      private translate:TranslateService,
      private alertCtrl:AlertController) {
  }

  ionViewDidLoad(){
    // TODO: check connections

    this.storage.get("session").then(
      (session:ISession) => {
        // check if we have a session
        if(session === null){
          // in case there is no session send the user to LoginPage
          this.navCtrl.push(LoginPage).then(
            () => debug("pushed LoginPage")
          )
        } else {
          // there is a session
          this.getStudentCourses(session).subscribe(
            (response:IPulsAPIResponse_getStudentCourses) => {
              this.eventSource = createEventSource(
                response.studentCourses.student.actualCourses.course
              );
              // this.calendarOptions.events = events;
              // this.calendar().fullCalendar(this.calendarOptions);
            }
          );
        }
      }
    );
  }

  /* ionic2-calendar specific methods */

  changeCalendarMode(mode){
    this.calendarOptions.calendarMode = mode;
  }


  /**
   * Sends request to PULS webservice and retrieves list of courses the student
   * is currently (current semester) enrolled in.
   * @param {IWebServices} webservices
   * @param {ISession} session
   * @returns {Observable<IPulsAPIResponse_getStudentCourses>}
   */
  private getStudentCourses(session:ISession):Observable<IPulsAPIResponse_getStudentCourses> {
    let webservices:IWebServices = <IWebServices>this.config.get("webservices");

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': webservices.apiToken
    });

    let request:IPulsApiRequest_getStudentCourses = {
      condition:{
        semester: 0,
        allLectures: 0
      },
      // TODO: refactor this someday so credentials are not used
      'user-auth': {
        username: session.credentials.username,
        password: session.credentials.password
      }
    };

    return this.http.post<IPulsAPIResponse_getStudentCourses>(
      webservices.endpoint.puls+"getStudentCourses",
      request,
      {headers: headers}
    );
  }

  openInformation(eventClicked){

  }
}
