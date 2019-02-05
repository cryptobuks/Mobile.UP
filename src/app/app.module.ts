import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BookListComponent } from './book-list/book-list.component';
import { CampusTabComponent } from './campus-tab/campus-tab.component';
import { ContentDrawerComponent } from './content-drawer/content-drawer.component';
import { EventViewComponent } from './event-view/event-view.component';
import { FooterDisclaimerComponent } from './footer-disclaimer/footer-disclaimer.component';
import { GradesTableComponent } from './grades-table/grades-table.component';
import { HintBoxComponent } from './hint-box/hint-box.component';
import { LectureListComponent } from './lecture-list/lecture-list.component';
import { MensaMealComponent } from './mensa-meal/mensa-meal.component';
import { NewsArticleComponent } from './news-article/news-article.component';
import { MomentPipe } from './moment.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CacheModule } from 'ionic-cache';
import { Network } from '@ionic-native/network/ngx';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    CampusTabComponent,
    ContentDrawerComponent,
    EventViewComponent,
    FooterDisclaimerComponent,
    GradesTableComponent,
    HintBoxComponent,
    LectureListComponent,
    MensaMealComponent,
    NewsArticleComponent,
    MomentPipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      backButtonIcon: 'ios-arrow-back',
      backButtonText: '',
      mode: 'md'
    }),
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
