
import { Input, Output, EventEmitter } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { LoadingModule } from './../modules/loading.module';

import { DataObject } from './../services/objects';

import { MangaInfoComponent } from './manga-info.component';

export abstract class MangaInfoPage extends LoadingModule {

  protected manga: DataObject;
  protected mangaInfo: MangaInfoComponent;
  @Output() dataToMangaInfo = new EventEmitter<DataObject>();

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

  public abstract dismiss(): void;

  protected passInformationToMangaInfo(infos: DataObject) {
    this.dataToMangaInfo.emit(infos)
  }

}
