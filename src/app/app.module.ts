import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CacheModule } from 'ionic-cache';
import { Network } from '@ionic-native/network/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { MomentPipe } from './pipes/moment.pipe';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { CalendarModule } from 'ion2-calendar';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    MomentPipe,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CalendarModule,
    IonicModule.forRoot({
      backButtonIcon: 'ios-arrow-back',
      backButtonText: '',
      mode: 'md'
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CacheModule.forRoot({ keyPrefix: 'cache-' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Device,
    SafariViewController,
    InAppBrowser,
    Keyboard,
    // tslint:disable-next-line: deprecation
    Contacts,
    CallNumber,
    LaunchNavigator,
    AppAvailability,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
