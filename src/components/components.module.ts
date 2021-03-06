import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { NewsArticleComponent } from './news-article/news-article';
import { ExpandableComponent } from './expandable/expandable';
import { EventViewComponent } from './event-view/event-view';
import { ContentDrawerComponent } from './content-drawer/content-drawer';
import { TabBarComponent } from './tab-bar/tab-bar';
import { CampusTabComponent } from './campus-tab/campus-tab';
import { BookListViewComponent } from './book-list-view/book-list-view';
import { GradesTableComponent } from './grades-table/grades-table';
import { LectureListComponent } from './lecture-list/lecture-list';
import { PopoverComponent } from './popover/popover';
import { FooterDisclaimerComponent } from './footer-disclaimer/footer-disclaimer';
import { HintComponent } from './hint/hint';
import { MensaMealComponent } from './mensa-meal/mensa-meal';

@NgModule({
	declarations: [
		NewsArticleComponent,
		ExpandableComponent,
		EventViewComponent,
    	ContentDrawerComponent,
    	TabBarComponent,
    	CampusTabComponent,
    	GradesTableComponent,
    	LectureListComponent,
    	BookListViewComponent,
		PopoverComponent,
    	FooterDisclaimerComponent,
    	HintComponent,
    	MensaMealComponent
	],
	imports: [
		IonicModule,
		TranslateModule
		],
	exports: [
		NewsArticleComponent,
		ExpandableComponent,
    	EventViewComponent,
    	ContentDrawerComponent,
    	TabBarComponent,
    	CampusTabComponent,
    	GradesTableComponent,
    	LectureListComponent,
    	BookListViewComponent,
    	PopoverComponent,
    	FooterDisclaimerComponent,
    	HintComponent,
    	MensaMealComponent
	]
})
export class ComponentsModule {}
