
import { Input, Output, EventEmitter } from '@angular/core';

import { LoadingModule } from './../modules/loading.module';

import { DataObject } from './../services/objects';

export abstract class MangaInfoPage extends LoadingModule {

  @Input() manga: DataObject;
  @Output() dataToMangaInfo = new EventEmitter<DataObject>();

  protected pageInfos: DataObject = {
    pageLoaded: false,
    allChecked: false
  }

  constructor() {
    super();
    this.pageInfos.pageLoaded = true;
  }

  public abstract dismiss(): void;

  protected passInformationToMangaInfo(infos: DataObject) {
    this.dataToMangaInfo.emit(infos)
  }

}
