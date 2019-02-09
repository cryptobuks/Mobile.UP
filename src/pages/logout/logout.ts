import { Component } from '@angular/core';
import { IonicPage, Nav, Events } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { HomePage } from '../home/home';
import { CacheService } from 'ionic-cache';
import { SessionProvider } from '../../providers/session/session';

/**
 * LogoutPage
 *
 * page that asks the user whether he/she really wants to be logged out
 */
@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  alreadyLoggedIn;

  constructor(
      private storage: Storage,
      private cache: CacheService,
      private events: Events,
      private sessionProvider: SessionProvider,
      private nav: Nav) {
  }

  async ngOnInit() {
    let tmp = await this.sessionProvider.getSession();
    var session = undefined;
    if (tmp) {
      if (typeof tmp !== 'object') {
        session = JSON.parse(tmp);
      } else { session = tmp; }
    }

    if (session) {
      this.alreadyLoggedIn = true;
    } else { this.alreadyLoggedIn = false; }
  }

  /**
   * performs logout by simply deleting the current session
   */
  public doLogout() {
    this.sessionProvider.removeSession();
    this.sessionProvider.removeUserInfo();
    var i; // clear saved grades from storage
    for (i = 0; i < 10; i++) { this.storage.remove("studentGrades["+i+"]"); }
    this.cache.clearAll();
    this.goHome();
  }

  /**
   * takes the user back to the previous page
   */
  public goHome() {
    setTimeout(() => {
      this.events.publish("userLogin");
      this.nav.setRoot(HomePage, {}, { animate: true, animation: "md-transition" });
    }, 1000);
  }
}
