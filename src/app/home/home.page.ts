import { Component, OnInit } from '@angular/core';
import { IModule } from '../interfaces';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { WebIntentService } from '../web-intent.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  icon_selected = 'star';
  icon_not_selected = 'star-outline';

  modules: {[moduleName: string]: IModule} = {};
  sortedModules = [];

  constructor(
    private navCtrl: NavController,
    private translate: TranslateService,
    private webIntent: WebIntentService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.storage.get('modules').then(modules => {
      if (modules) {
        this.modules = modules;
        this.sortedModules = this.JsonToArray(this.modules);
      } else {
        this.storage.get('default_modules').then(default_modules => {
          if (default_modules) {
            this.modules = default_modules;
            this.sortedModules = this.JsonToArray(this.modules);
          } else {
            // something clearly went wrong here
            console.log('[HomePage]: Neither user defined modules nor default_modules in storage!');
          }
        });
      }
    });
  }

  /**
   * @name JsonToArray
   * @description converts json object to array
   * @param modules
   * @returns {Array} array
   */
  JsonToArray(modules) {
    const array = [];
    for (const key in modules) {
      if (modules.hasOwnProperty(key)) {
        this.translate.get(modules[key].i18nKey).subscribe(
          value => {
            modules[key].translation = value;
            array.push(modules[key]);
          }
        );
      }
    }
    // this.orderPipe.transform(this.sortedModules, 'translation');
    return array;
  }

  /**
   * @name toggleSelectedState
   * @description toggles selected-state of given module and then saves moduleList to storage
   * @param event
   * @param moduleName
   */
  toggleSelectedState(event, moduleName) {
    event.stopPropagation();
    const currentState = this.modules[moduleName].selected;
    const newState = !currentState;

    this.modules[moduleName].selected = newState;

    console.log(`[HomePage]: '${moduleName}' is now ${newState ? 'selected' : 'not selected'}`);

    this.storage.set('modules', this.modules).then(
      () => console.log(`[HomePage]: Saved module list after toggling '${moduleName}'`)
    );
  }

  /**
   * @name openPage
   * @description opens selected page by pushing it on the stack
   * @param event
   * @param {string} pageTitle
   */
  openPage(modules: IModule) {
    console.log(modules);
    if (modules.url) {
      this.webIntent.handleWebIntentForModule(modules.componentName);
    } else {
      this.navCtrl.navigateForward('/' + modules.componentName);
    }
  }
}
