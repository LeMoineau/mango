
import { Input, Output, EventEmitter } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { LoadingModule } from './../modules/loading.module';

import { DataObject } from './../services/objects';

import { MangaInfoComponent } from './manga-info.component';

export abstract class MangaInfoPage extends LoadingModule {

  protected manga: DataObject;
  protected mangaInfo: MangaInfoComponent;

  public globalCheckMode: boolean = false;

  protected pageInfos: DataObject = {
    pageLoaded: false,
    allChecked: false
  }

  constructor(navParams: NavParams) {
    super();
    this.pageInfos.pageLoaded = true;
    this.manga = navParams.get("manga");
    this.mangaInfo = navParams.get("mangaInfo");
  }

  protected passInformationToMangaInfo(infos: DataObject) {
    this.mangaInfo.dataToMangaInfo(infos)
  }

  public setGlobalCheckMode(val: boolean) {
    this.globalCheckMode = val;
    console.log("coucou")
  }

}
