import { Component } from '@angular/core';
import { Platform, Events, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IConfig, IModule, IOIDCRefreshResponseObject, ISession, IOIDCUserInformationResponse } from './interfaces';
import { Storage } from '@ionic/storage';
import { UserSessionService } from './user-session.service';
import * as moment from 'moment';
import { LoginService } from './login.service';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './settings.service';
import { ConnectionService } from './connection.service';
import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  userInformation: IOIDCUserInformationResponse = null;
  loggedIn = false;
  username;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    private statusBar: StatusBar,
    private http: HttpClient,
    private menuCtrl: MenuController,
    private cache: CacheService,
    private navCtrl: NavController,
    private userSession: UserSessionService,
    private setting: SettingsService,
    private connection: ConnectionService,
    private events: Events,
    private login: LoginService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('ios') || this.platform.is('android')) {
          this.statusBar.styleDefault();
        }

        this.splashScreen.hide();
      }
      this.prepareStorageOnAppUpdate();
      this.initTranslate();
      this.connection.initializeNetworkEvents();
      this.updateLoginStatus();
      this.cache.setDefaultTTL(60 * 60 * 2);
      this.cache.setOfflineInvalidate(false);

      this.events.subscribe('userLogin', () => {
        this.updateLoginStatus();
      });
    });
  }

  /**
   * @name prepareStorageOnAppUpdate
   * @description clears the storage if user has a old version of the app
   */
  prepareStorageOnAppUpdate() {
    this.http.get('assets/config.json').subscribe(async (response: IConfig) => {
      const config: IConfig = response;
      const savedVersion = await this.storage.get('appVersion');

      if (!savedVersion) {
        // user has never opened a 6.x version of the app, since nothing is stored
        // clear the whole storage
        this.storage.clear().then(() => {
          console.log('[Mobile.UP]: cleared storage');
          this.storage.set('appVersion', config.appVersion);
          this.storage.set('config', config);
          this.buildDefaultModulesList(config);
          this.checkSessionValidity(config);
        }, error => {
          console.log('[ERROR]: clearing storage failed');
          console.log(error);
        });
      } else {
        this.storage.set('appVersion', config.appVersion);
        this.storage.set('config', config);
        this.buildDefaultModulesList(config);
        this.checkSessionValidity(config);
      }
    }, error => {
      console.log(error); // error message as string
    });
  }

  /**
   * @name buildDefaultModulesList
   * @description builds list of default_modules that should be displayed on HomePage
   */
  buildDefaultModulesList(config: IConfig) {
    const moduleList: {[modulesName: string]: IModule} = {};
    const modules = config.modules;

    for (const moduleName in modules) {
      if (modules.hasOwnProperty(moduleName)) {
        const moduleToAdd: IModule = modules[moduleName];
        if (!moduleToAdd.hide) {
          moduleToAdd.i18nKey = `page.${moduleToAdd.componentName}.title`;
          moduleList[moduleName] = moduleToAdd;
        }
      }
    }

    this.storage.set('default_modules', moduleList);
    console.log('[Mobile.UP]: created default moduleList from config');
  }

  /**
   * @name checkSessionValidity
   * @description checks whether the current session is still valid. In case it is, the
   * session will be refreshed anyway. Otherwise the currently stored session
   * object is deleted.
   */
  async checkSessionValidity(config: IConfig) {
    const session: ISession = await this.userSession.getSession();

    if (session) {
      // helper function for determining whether session is still valid
      const sessionIsValid = (timestampThen: Date, expiresIn: number, boundary: number) => {
        // determine date until the token is valid
        const validUntilUnixTime = moment(timestampThen).unix() + expiresIn;
        const nowUnixTime = moment().unix();
        // check if we are not past this date already with a certain boundary

        return (validUntilUnixTime - nowUnixTime) > boundary;
      };

      if (sessionIsValid(session.timestamp, session.oidcTokenObject.expires_in, config.general.tokenRefreshBoundary)) {
        this.login.oidcRefreshToken(session.oidcTokenObject.refresh_token, config.authorization.oidc)
          .subscribe((response: IOIDCRefreshResponseObject) => {
            const newSession = {
              oidcTokenObject:  response.oidcTokenObject,
              token:            response.oidcTokenObject.access_token,
              timestamp:        new Date(),
              credentials:      session.credentials
            };

            this.userSession.setSession(newSession);

            this.login.oidcGetUserInformation(newSession, config.authorization.oidc).subscribe(userInformation => {
              this.userSession.setUserInfo(userInformation);
            }, error => {
              console.log(error);
            });
          }, error => {
            console.log('[Mobile.UP]: error refreshing token');
            console.log(error);
          });
      } else {
        // session no longer valid
        this.userSession.removeSession();
        this.userSession.removeUserInfo();
      }
    }
  }

  /**
   * @name  initTranslate
   * @description sets up translation
   */
  async initTranslate() {
    this.translate.setDefaultLang('de');
    const lang = await this.setting.getSettingValue('language');

    if (lang === 'Deutsch') {
      this.translate.use('de');
      moment.locale('de');
    } else {
      this.translate.use('en');
      moment.locale('en');
    }
  }

  async updateLoginStatus() {
    this.loggedIn = false;
    this.userInformation = undefined;
    this.username = undefined;

    const session: ISession = await this.userSession.getSession();

    if (session) {
      this.loggedIn = true;
      this.username = session.credentials.username;
    }

    this.userInformation = await this.userSession.getUserInfo();
  }

  close() {
    this.menuCtrl.close();
  }
  toHome() {
    this.close();
    this.navCtrl.navigateRoot('/home');
  }

  doLogout() {
    this.close();
    // TODO: logout popover
    this.userSession.removeSession();
    this.userSession.removeUserInfo();
    for (let i = 0; i < 10; i++) { this.storage.remove('studentGrades[' + i + ']'); }
    this.cache.clearAll();
    this.updateLoginStatus();
    this.navCtrl.navigateRoot('/home');
  }

  toLogin() {
    this.close();
    this.navCtrl.navigateForward('/login');
  }

  toSettings() {
    this.close();
    this.navCtrl.navigateForward('/settings');
  }

  toAppInfo() {
    this.close();
    this.navCtrl.navigateForward('/app-info');
  }

  toImprint() {
    this.close();
    this.navCtrl.navigateForward('/impressum');
  }


}
