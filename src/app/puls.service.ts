import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService } from './user-session.service';
import { AlertService } from './alert.service';
import { ISession, IPulsApiRequestGetStudentCourses, IConfig, IPulsAPIResponseGetStudentCourses } from './interfaces';
import { Observable, ReplaySubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PulsService implements OnInit {

  config: IConfig;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private userSession: UserSessionService,
    private storage: Storage,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    this.config = await this.storage.get('config');
  }

  getStudentCourses(session: ISession): Observable<IPulsAPIResponseGetStudentCourses> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.config.webservices.apiToken
    });

    const request: IPulsApiRequestGetStudentCourses = {
      condition: {
        semester: 0,
        allLectures: 0
      },
      // TODO: refactor this someday so credentials are not used
      'user-auth': {
        username: session.credentials.username,
        password: session.credentials.password
      }
    };

    const rs = new ReplaySubject<IPulsAPIResponseGetStudentCourses>();

    // TODO: check for connection first!
    this.http.post<IPulsAPIResponseGetStudentCourses>(
      this.config.webservices.endpoint.puls + 'getStudentCourses',
      request,
      {headers: headers}
    ).subscribe((response: IPulsAPIResponseGetStudentCourses) => {
        // PULS simply responds with 'no user rights' if credentials are incorrect
        if (response.message === 'no user rights') {
          // we're having a contradiction here, the password is wrong, but
          // the token is still valid. We'll log the user out and send the
          // user to LoginPage

          rs.next(response);

          this.alertService.showAlert({
            alertTitleI18nKey: 'alert.title.error',
            messageI18nKey: 'alert.token_valid_credentials_invalid',
          });
        } else {
          rs.next(response);
        }
      }, error => {
        console.log(error);
      });

    return rs;
  }

  /**
   * handles special case as described in #81
   */
  async handleSpecialCase() {
    this.userSession.removeSession();
    this.userSession.removeUserInfo();
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('alert.title.error'),
      message: this.translate.instant('alert.token_valid_credentials_invalid')
    });
    alert.present();
    this.navCtrl.navigateForward('/login');
  }
}
