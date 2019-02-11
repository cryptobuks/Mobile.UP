import {ConnectionProvider} from "../providers/connection/connection";
import {Injector, Type} from "@angular/core";
import {StaticInjectorService} from "./StaticInjector";
import {SessionProvider} from "../providers/session/session";
import {ISession} from "../providers/login-provider/interfaces";

import {LoginPage} from "../pages/login/login";
import {ReplaySubject} from "rxjs";
import {App} from "ionic-angular";

export interface IPageOptions {
  requireSession?:boolean;
  requireNetwork?:boolean;
}

/**
 * @name AbstractPage
 * @classdesc An abstract implementation of a Page already implementing basic
 * features most Pages might use. To fire those features only this classes
 * constructor must be called with the desired options.
 *
 * https://robferguson.org/blog/2018/09/28/ionic-3-component-inheritance/
 */
export abstract class AbstractPage  {

  protected session:ISession;
  protected sessionObservable:ReplaySubject<ISession>;
  protected connection:ConnectionProvider;
  protected sessionProvider:SessionProvider;
  protected app:App;

  protected constructor(pageOptions?:IPageOptions){

    const injector: Injector = StaticInjectorService.getInjector();
    this.connection = injector.get<ConnectionProvider>(ConnectionProvider as Type<ConnectionProvider>);
    this.sessionProvider = injector.get<SessionProvider>(SessionProvider as Type<SessionProvider>);
    this.app = injector.get<App>(App as Type<App>);

    this.processOptions(pageOptions);
  }

  private processOptions(pageOptions:IPageOptions){
    if(pageOptions.requireSession) { this.requireSession() }
    if(pageOptions.requireNetwork) { this.requireNetwork()}
  }

  /**
   * @name requireNetwork
   * @desc tests for network connection and sends the user back to the HomePage
   * if there is none;
   */
  requireNetwork(){
    console.log("[AbstractPage]: Requires network");
    this.connection.checkOnline(true, true);
  }

  /**
   * @name requireSession
   * @desc tests for existing sessionProvider and sends user to LoginPage in case none is
   * found
   */
  requireSession() {
    console.log("[AbstractPage]: Requires session");

    // TODO: not working yet. SessionProvider is setting the session too slowly.
    // so this function will always find that there is no session, even though
    // some milliseconds later there would be one.

    // this.sessionObservable = new ReplaySubject<ISession>();
    //
    // this.sessionProvider.getSession().then(
    //   (sessionObj:ISession) => {
    //     if (sessionObj) {
    //       if (typeof sessionObj !== 'object') {
    //         this.session = JSON.parse(sessionObj);
    //       } else {
    //         this.session = sessionObj;
    //       }
    //       this.sessionObservable.next(this.session);
    //     } else {
    //       this.sessionObservable.error("no session");
    //
    //       console.log("Pushing LoginPage");
    //       this.app.getActiveNavs()[0].push(LoginPage);
    //     }
    //   }
    // );
  }

}
