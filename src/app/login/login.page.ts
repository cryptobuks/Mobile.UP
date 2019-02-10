import { Component, OnInit } from '@angular/core';
import { ICredentials, ELoginErrors, IConfig, ISession, IOIDCUserInformationResponse } from '../interfaces';
import { AlertController, Events, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UserSessionService } from '../services/user-session/user-session.service';
import { ConnectionService } from '../services/connection/connection.service';
import { LoginService } from '../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading;
  alreadyLoggedIn: boolean;
  config: IConfig;

  // This object will hold the data the user enters in the login form
  loginCredentials: ICredentials = {
    username: '',
    password: ''
  };

  constructor(
    private userSession: UserSessionService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private connection: ConnectionService,
    private upLogin: LoginService,
    private events: Events,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    const session = await this.userSession.getSession();
    this.config = await this.storage.get('config');

    if (session) {
      this.alreadyLoggedIn = true;
    } else { this.alreadyLoggedIn = false; }

    this.connection.checkOnline(true, true);
  }

  /**
   * logins
   *
   * Uses AuthServiceProvider to execute login. If login is successful the user
   * is taken back to the previous page. If not, an alert is shown.
   */
  public async login () {

    this.showLoading();

    // prepare Observable for use in switch
    const sessionObs: Observable<ISession> = this.upLogin.oidcLogin(
      this.autoCorrectUsername(this.loginCredentials),
      this.config.authorization.oidc
    );

    if (sessionObs) {
      // now handle the Observable which hopefully contains a session
      sessionObs.subscribe(
        (session: any) => {
          console.log(`[LoginPage]: Login successfully executed. Token: ${session.token}`);
          this.userSession.setSession(session);

          this.endLoading();

          // in the meantime get user information and save it to storage
          this.upLogin.oidcGetUserInformation(session, this.config.authorization.oidc).subscribe(
            (userInformation: IOIDCUserInformationResponse) => {
              this.userSession.setUserInfo(userInformation);
            },
            error => {
              // user must not know if something goes wrong here, so we don't
              // create an alert
              console.log(`[LoginPage]: Could not retrieve user information because:\n${JSON.stringify(error)}`);
            }
          );

          setTimeout(() => {
            this.events.publish('userLogin');
            this.navCtrl.navigateBack('/home');
          }, 1000);
        }, error => {
          console.log(error);
          this.endLoading();
          this.showAlert(error.reason);
        }
      );
    } else {
      this.showAlert(ELoginErrors.UNKNOWN_ERROR);
      console.log('[LoginPage]: Somehow no session has been passed by login-provider');
    }
  }

  autoCorrectUsername(loginCredentials: ICredentials) {
    // removes everything after (and including) @ in the username
    const foundAt = loginCredentials.username.indexOf('@');
    if (foundAt !== -1) {
      loginCredentials.username = loginCredentials.username.substring(0, foundAt);
      this.loginCredentials.username = loginCredentials.username;
    }

    return loginCredentials;
  }

  /**
   * showLoading
   *
   * shows a loading animation
   */
  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: this.translate.instant('page.login.loginInProgress'),
      spinner: 'crescent'
    });
    this.loading.present();
  }

  /**
   * endLoading
   *
   * ends the loading animation
   */
  private endLoading(): void {
    this.loading.dismiss();
  }

  /**
   * showAlert
   *
   * shows an alert
   */
  async showAlert(errorCode: ELoginErrors) {

    const alert = await this.alertCtrl.create({
      header: this.translate.instant('alert.title.error'),
      message: this.translate.instant(`page.login.loginError.${errorCode}`),
      buttons: [ this.translate.instant('button.continue') ]
    });
    alert.present();
  }

  public abort() {
    this.navCtrl.navigateRoot('/home');
  }

}
