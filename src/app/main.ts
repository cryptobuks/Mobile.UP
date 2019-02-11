import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import {StaticInjectorService} from "../library/StaticInjector";

platformBrowserDynamic().bootstrapModule(AppModule).then(
  (moduleRef) => {
  StaticInjectorService.setInjector(moduleRef.injector);
}).catch(error => console.log(error));
