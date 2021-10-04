
import { Input } from '@angular/core';

import { LoadingModule } from './../modules/loading.module';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

export abstract class MangaInfoPage extends LoadingModule {

  @Input() manga: DataObject;

  protected pageInfos: DataObject = {
    pageLoaded: false,
    NotFoundMessage: null,
    allChecked: false
  }

  constructor() {
    super();
    this.pageInfos.pageLoaded = true;
    this.pageInfos.NotFoundMessage = getRandomNotFoundMessage();
  }

  public abstract dismiss(): void;

}
