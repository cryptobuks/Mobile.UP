import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintBoxComponent } from '../hint-box/hint-box.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { CampusTabComponent } from '../campus-tab/campus-tab.component';

@NgModule({
  declarations: [
    HintBoxComponent,
    CampusTabComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    HintBoxComponent,
    CampusTabComponent
  ]
})
export class ComponentsModule { }
