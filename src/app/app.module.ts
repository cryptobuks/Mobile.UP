import { ComponentsModule } from './../components/components.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER} from '@angular/core';
import { IonicApp, IonicModule, DeepLinkConfig } from 'ionic-angular';
import { MobileUPApp } from './app.component';
import { UPLoginProvider } from "../providers/login-provider/login";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { EmergencyPage } from '../pages/emergency/emergency';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { CalendarModule } from "ion2-calendar";
import { CacheModule } from "ionic-cache";
import { OrderModule } from 'ngx-order-pipe';
import { NgCalendarModule } from "ionic2-calendar";
import { Device } from '@ionic-native/device/ngx';
import { PulsProvider } from '../providers/puls/puls';
import { ConnectionProvider } from '../providers/connection/connection';
import { Network } from "@ionic-native/network/ngx";
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeDe);
registerLocaleData(localeEn);
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Contacts } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number/ngx';

/* Pages */
import { HomePage } from '../pages/home/home';
import { ImpressumPage } from '../pages/impressum/impressum';
import { LoginPage } from "../pages/login/login";
import { LogoutPage } from "../pages/logout/logout";
import { PracticePage } from "../pages/practice/practice";
import { PersonsPage } from "../pages/persons/persons";
import { MensaPage } from "../pages/mensa/mensa";
import { NewsPage } from './../pages/news/news';
import { EventsPage } from './../pages/events/events';
import { RoomsPage } from "../pages/rooms/rooms";
import { RoomplanPage } from "../pages/roomplan/roomplan";
import { SettingsPage } from "../pages/settings/settings";
import { SettingsProvider } from '../providers/settings/settings';
import { WebIntentProvider } from '../providers/web-intent/web-intent';
import { LibraryPage } from '../pages/library/library';
import { BookDetailViewPage } from '../pages/book-detail-view/book-detail-view';
import { GradesPage } from '../pages/grades/grades';
import { LecturesPage } from '../pages/lectures/lectures';
import { LegalNoticePage } from '../pages/legal-notice/legal-notice';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TransportPage } from '../pages/transport/transport';
import { TermsOfUsePage } from '../pages/terms-of-use/terms-of-use';
import { ConfigProvider } from '../providers/config/config';
import { EventModal, TimetablePage } from "../pages/timetable/timetable";
import { PopoverComponent } from "../components/popover/popover";
import { OpeningHoursPage } from '../pages/opening-hours/opening-hours';
import { DetailedOpeningPage } from '../pages/detailed-opening/detailed-opening';
import { DetailedPracticePage } from '../pages/detailed-practice/detailed-practice';
import { PopoverButton } from "../components/popover/popover-button";
import { AppInfoPage } from "../pages/app-info/app-info";
import { SessionProvider } from '../providers/session/session';
import { MapsProvider } from '../providers/maps/maps';
import { AlertProvider } from '../providers/alert/alert';
import { MobileUPErrorHandler } from '../library/errorHandler';
import { ErrorLoggingProvider } from '../providers/error-logging/error-logging';

import { MomentPipe } from '../pipes/moment/moment';
import { WebServiceProvider } from '../providers/web-service/web-service';
import { CampusMapPage } from '../pages/campus-map/campus-map';
import { FeedbackPage } from '../pages/feedback/feedback';
import { DeviceProvider } from '../providers/device/device';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function initConfig(config:ConfigProvider) {
  return () => config.load('assets/config.json');
}

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: HomePage, name: 'HomePage', segment: 'home' },
    { component: LoginPage, name: 'LoginPage', segment: 'login' },
    { component: LogoutPage, name: 'LogoutPage', segment: 'logout' },
    { component: EventsPage, name: 'EventsPage', segment: 'events'},
    { component: ImpressumPage, name: 'ImpressumPage', segment: 'imprint' },
    { component: PrivacyPolicyPage, name: 'PrivacyPolicyPage', segment: 'privacy' },
    { component: LegalNoticePage, name: 'LegalNoticePage', segment: 'legal' },
    { component: EmergencyPage, name: 'EmergencyPage', segment: 'emergency' },
    { component: PersonsPage, name: 'PersonsPage', segment: 'persons' },
    { component: MensaPage, name: 'MensaPage', segment: 'mensa' },
    { component: SettingsPage, name: 'SettingsPage', segment: 'settings' },
    { component: LibraryPage, name: 'LibraryPage', segment: 'library' },
    { component: PracticePage, name: 'PracticePage', segment: 'practice' },
    { component: NewsPage, name: 'NewsPage', segment: 'news' },
    { component: TimetablePage, name: 'TimetablePage', segment: 'timetable' },
    { component: GradesPage, name: 'GradesPage', segment: 'grades' },
    { component: RoomsPage, name: 'RoomsPage', segment: 'rooms' },
    { component: LecturesPage, name: 'LecturesPage', segment: 'lectures' },
    { component: RoomplanPage, name: 'RoomplanPage', segment: 'roomplan' },
    { component: OpeningHoursPage, name: 'OpeningHoursPage', segment: 'opening-hours' },
    { component: AppInfoPage, name: 'AppInfoPage', segment: 'about'},
    { component: TransportPage, name: 'TransportPage', segment: 'transport'},
    { component: CampusMapPage, name: 'CampusMapPage', segment: 'campusmap'},
    { component: FeedbackPage, name: 'FeedbackPage', segment: 'feedback'}
  ]
};

@NgModule({
  declarations: [
    MobileUPApp,
    HomePage,
    LoginPage,
    LogoutPage,
    ImpressumPage,
    EmergencyPage,
    PersonsPage,
    MensaPage,
    SettingsPage,
    LibraryPage,
    BookDetailViewPage,
    PracticePage,
    NewsPage,
    EventsPage,
    GradesPage,
    RoomsPage,
    LecturesPage,
    RoomplanPage,
    LegalNoticePage,
    PrivacyPolicyPage,
    TermsOfUsePage,
    TimetablePage,
    EventModal,
    OpeningHoursPage,
    DetailedOpeningPage,
    DetailedPracticePage,
    PopoverButton,
    AppInfoPage,
    TransportPage,
    MomentPipe,
    CampusMapPage,
    FeedbackPage
  ],
  imports: [
    HttpClientModule,
    ComponentsModule,
    BrowserModule,
    CalendarModule,
    OrderModule,
    CacheModule.forRoot({ keyPrefix: 'myCache-' }),
    IonicModule.forRoot(
      MobileUPApp,
      {
        backButtonText: ' ',
        mode: 'md'
      },
      deepLinkConfig
    ),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MobileUPApp,
    HomePage,
    LoginPage,
    LogoutPage,
    ImpressumPage,
    EmergencyPage,
    PersonsPage,
    LibraryPage,
    MensaPage,
    SettingsPage,
    BookDetailViewPage,
    PracticePage,
    NewsPage,
    EventsPage,
    GradesPage,
    RoomsPage,
    LecturesPage,
    RoomplanPage,
    LegalNoticePage,
    PrivacyPolicyPage,
    TermsOfUsePage,
    OpeningHoursPage,
    DetailedOpeningPage,
    DetailedPracticePage,
    TimetablePage,
    EventModal,
    PopoverComponent,
    AppInfoPage,
    TransportPage,
    CampusMapPage,
    FeedbackPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: MobileUPErrorHandler
    },
    UPLoginProvider,
    InAppBrowser,
    SettingsProvider,
    Keyboard,
    SafariViewController,
    AppAvailability,
    WebIntentProvider,
    Device,
    LaunchNavigator,
    ConfigProvider,
    SessionProvider,
    SecureStorage,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigProvider],
      multi: true
    },
    PulsProvider,
    Network,
    ConnectionProvider,
    MapsProvider,
    AlertProvider,
    ErrorLoggingProvider,
    WebServiceProvider,
    Contacts,
    CallNumber,
    DeviceProvider
  ]
})
export class AppModule {
}
