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

@NgModule({
  declarations: [AppComponent, BookListComponent, CampusTabComponent, ContentDrawerComponent, EventViewComponent, FooterDisclaimerComponent, GradesTableComponent, HintBoxComponent, LectureListComponent, MensaMealComponent, NewsArticleComponent, MomentPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
