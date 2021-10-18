
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonNav } from '@ionic/angular';

import { MangaInfoComponent } from './manga-info/manga-info.component';
import { MangathequeComponent } from './mangatheque/mangatheque.component';
import { SettingsComponent } from './settings/settings.component';
import { DownloadComponent } from './download/download.component';
import { GlobalHeaderComponent } from './global/global-header/global-header.component';

import { SynchroniserSuperTabs } from './modules/synchroniser-super-tabs.module';

import { DataObject } from './services/objects';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends SynchroniserSuperTabs implements AfterViewInit {

  private thisInstance;
  private mangatheque = MangathequeComponent;
  private download = DownloadComponent;
  private settings = SettingsComponent;

  @ViewChild('header') globalHeader: GlobalHeaderComponent;

  constructor() {
    super();
    this.thisInstance = this;
  }

  ngAfterViewInit() {

  }

  //Specifics Methods
  private tabChangeEvent(event) {
    if (event.detail.changed) {
      this.globalHeader.setSelectedTab(event.detail.index);
    }
  }

  private searchingReturn(result) {
    if (result.tabIndex === 0) {
      if (this.getTab("downloadPage") !== undefined) {
        this.getTab("downloadPage").addSearchingResult(result)
      }
    } else if (result.tabIndex === 1) {

    } else if (result.tabIndex === 2) {

    }
  }

}
