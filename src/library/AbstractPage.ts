import {ConnectionProvider} from "../providers/connection/connection";
import {Injector, Type} from "@angular/core";
import {StaticInjectorService} from "./StaticInjector";
import {SessionProvider} from "../providers/session/session";
import {ISession} from "../providers/login-provider/interfaces";
import {type} from "os";

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
export abstract class AbstractPage {

  private connection:ConnectionProvider;
  private session:SessionProvider;

  constructor(pageOptions?:IPageOptions){

    const injector: Injector = StaticInjectorService.getInjector();
    this.connection = injector.get<ConnectionProvider>(ConnectionProvider as Type<ConnectionProvider>);
    this.session = injector.get<SessionProvider>(SessionProvider as Type<SessionProvider>);

    if(pageOptions.requireSession) { this.requireSession() }
    if(pageOptions.requireNetwork) { this.requireNetwork()}
  }

  /**
   * @name requireNetwork
   * @desc tests for network connection and sends the user back to the HomePage
   * if there is none;
   */
  requireNetwork(){
    console.log("Require network");
    this.connection.checkOnline(true, true);
  }

  /**
   * @name requireSession
   * @desc tests for existing session and sends user to LoginPage in case none is
   * found
   */
  requireSession() {
    console.log("Requires session");
    // TODO
  }

}
