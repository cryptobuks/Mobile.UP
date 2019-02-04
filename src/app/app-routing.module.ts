import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'app-info', loadChildren: './app-info/app-info.module#AppInfoPageModule' },
  { path: 'campus-map', loadChildren: './campus-map/campus-map.module#CampusMapPageModule' },
  { path: 'emergency', loadChildren: './emergency/emergency.module#EmergencyPageModule' },
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'grades', loadChildren: './grades/grades.module#GradesPageModule' },
  { path: 'impressum', loadChildren: './impressum/impressum.module#ImpressumPageModule' },
  { path: 'lectures', loadChildren: './lectures/lectures.module#LecturesPageModule' },
  { path: 'library-search', loadChildren: './library-search/library-search.module#LibrarySearchPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'mensa', loadChildren: './mensa/mensa.module#MensaPageModule' },
  { path: 'news', loadChildren: './news/news.module#NewsPageModule' },
  { path: 'opening-hours', loadChildren: './opening-hours/opening-hours.module#OpeningHoursPageModule' },
  { path: 'person-search', loadChildren: './person-search/person-search.module#PersonSearchPageModule' },
  { path: 'practice', loadChildren: './practice/practice.module#PracticePageModule' },
  { path: 'roomplan', loadChildren: './roomplan/roomplan.module#RoomplanPageModule' },
  { path: 'free-rooms', loadChildren: './free-rooms/free-rooms.module#FreeRoomsPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'timetable', loadChildren: './timetable/timetable.module#TimetablePageModule' },
  { path: 'transport', loadChildren: './transport/transport.module#TransportPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
