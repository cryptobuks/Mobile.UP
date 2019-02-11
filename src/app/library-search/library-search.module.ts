import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LibrarySearchPage } from './library-search.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';
import { BookDetailModalPage } from '../components/book-list/book-detail.modal';

const routes: Routes = [
  {
    path: '',
    component: LibrarySearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [
    LibrarySearchPage,
    BookDetailModalPage
  ],
  entryComponents: [
    BookDetailModalPage
  ]
})
export class LibrarySearchPageModule {}
