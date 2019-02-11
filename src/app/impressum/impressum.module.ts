import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ImpressumPage } from './impressum.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { ImpressumModalPage } from './impressum.modal';

const routes: Routes = [
  {
    path: '',
    component: ImpressumPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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
    ImpressumPage,
    ImpressumModalPage
  ],
  entryComponents: [
    ImpressumModalPage
  ]
})
export class ImpressumPageModule {}
