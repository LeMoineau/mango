
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonNav } from '@ionic/angular';

import { MangaInfoComponent } from './manga-info/manga-info.component';
import { MangathequeComponent } from './mangatheque/mangatheque.component';
import { SettingsComponent } from './settings/settings.component';
import { DownloadComponent } from './download/download.component';
import { GlobalHeaderComponent } from './global/global-header/global-header.component';

import { DataObject } from './services/objects';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {

  private thisInstance;
  private mangatheque = MangathequeComponent;
  private download = DownloadComponent;
  private settings = SettingsComponent;

  @ViewChild('header') globalHeader: GlobalHeaderComponent;
  @ViewChild('test') test: IonNav;

  private pages: DataObject = {

  }

  constructor() {
    this.thisInstance = this;
  }

  ngAfterViewInit() {

  }

  tester() {
    console.log("coucou")
    this.test.push(MangaInfoComponent, {manga: {
      title: "test"
    }})
  }

  //Specifics Methods
  private tabChangeEvent(event) {
    if (event.detail.changed) {
      this.globalHeader.setSelectedTab(event.detail.index);
    }
  }

  private searchingReturn(result) {
    if (result.tabIndex === 0) {
      if (this.pages["downloadPage"] !== undefined) {
        this.pages["downloadPage"].addSearchingResult(result)
      }
    } else if (result.tabIndex === 1) {

    } else if (result.tabIndex === 2) {

    }
  }

  public synchronisePage(pageName: string, component: any) {
    this.pages[pageName] = component
  }

}
