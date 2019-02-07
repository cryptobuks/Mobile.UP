import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISession } from "../login-provider/interfaces";
import { Observable, ReplaySubject } from "rxjs";
import {
  IPulsApiRequest_getStudentCourses,
  IPulsAPIResponse_getStudentCourses,
  IPulsApiRequest_getLectureScheduleAll,
  IPulsAPIResponse_getLectureScheduleAll
} from "../../library/interfaces_PULS";
import { ConfigProvider } from "../config/config";
import { LoginPage } from "../../pages/login/login";
import {
  AlertController,
  App,
} from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { SessionProvider } from '../session/session';
import {AlertProvider} from "../alert/alert";

@Injectable()
export class PulsProvider {

  constructor(public http: HttpClient,
              private alertCtrl: AlertController,
              private translate: TranslateService,
              private sessionProvider: SessionProvider,
              private app: App,
              private alertProvider: AlertProvider) {
  }

  public getStudentCourses(session:ISession):Observable<IPulsAPIResponse_getStudentCourses> {

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ConfigProvider.config.webservices.apiToken
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

    let rs = new ReplaySubject<IPulsAPIResponse_getStudentCourses>();

    // TODO: check for connection first!
    this.http.post<IPulsAPIResponse_getStudentCourses>(
      ConfigProvider.config.webservices.endpoint.puls+"getStudentCourses",
      request,
      {headers: headers}
    ).subscribe(
      (response:IPulsAPIResponse_getStudentCourses) => {
        // PULS simply responds with "no user rights" if credentials are incorrect
        if(response.message == "no user rights") {
          // we're having a contradiction here, the password is wrong, but
          // the token is still valid. We'll log the user out and send the
          // user to LoginPage

          rs.next(response);

          this.alertProvider.showAlert({
            alertTitleI18nKey: "alert.title.error",
            messageI18nKey: "alert.token_valid_credentials_invalid",
          })
        } else {
          rs.next(response);
        }
      },
      error => {

      }
    );

    return rs;
  }

  public getLectureScheduleAll():Observable<IPulsAPIResponse_getLectureScheduleAll> {

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ConfigProvider.config.webservices.apiToken
    });

    let request:IPulsApiRequest_getLectureScheduleAll = {
      condition:{
        semester: 0
      }
    };

    let rs = new ReplaySubject<IPulsAPIResponse_getLectureScheduleAll>();

    // TODO: check for connection first!
    this.http.post<IPulsAPIResponse_getLectureScheduleAll>(
      ConfigProvider.config.webservices.endpoint.puls+"getLectureScheduleAll",
      request,
      {headers: headers}
    ).subscribe(
      (response:IPulsAPIResponse_getLectureScheduleAll) => {
        // PULS simply responds with "no user rights" if credentials are incorrect
        if(response.message == "no user rights") {
          // we're having a contradiction here, the password is wrong, but
          // the token is still valid. We'll log the user out and send the
          // user to LoginPage

          rs.next(response);

          this.alertProvider.showAlert({
            alertTitleI18nKey: "alert.title.error",
            messageI18nKey: "alert.token_valid_credentials_invalid",
          })
        } else {
          rs.next(response);
        }
      },
      error => {

      }
    );

    return rs;
  }

  /**
   * handles special case as described in #81
   */
  public handleSpecialCase() {
    this.sessionProvider.removeSession();
    this.sessionProvider.removeUserInfo();
    let alert = this.alertCtrl.create({
      title: this.translate.instant("alert.title.error"),
      subTitle: this.translate.instant("alert.token_valid_credentials_invalid")
    });
    alert.present();
    this.app.getRootNavs()[0].push(LoginPage)
  }

}
