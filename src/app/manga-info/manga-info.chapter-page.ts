
import { Input } from '@angular/core';

import { MangaInfoPage } from './manga-info.page';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

export abstract class MangaInfoChapterPage extends MangaInfoPage {

  constructor() {
    super();
  }

  protected abstract getChapters(): DataObject[];
  protected abstract setChapters(val): void;

  public noChapters() {
    return (!this.pageInfos.pageLoaded
      || (this.getChapters() !== undefined && (this.getChapters()).length <= 0)
      || this.getChapters() === undefined
    )
  }

  protected hasChapters(): boolean {
    return (this.getChapters() !== undefined && this.getChapters().length > 0)
  }

  protected setChaptersAllChecked() {
    if (this.hasChapters()) {
      this.pageInfos.allChecked = !this.pageInfos.allChecked;
      this.setChapters(this.getChapters().map((chap) => {
        let tmp = chap;
        tmp.selected = this.pageInfos.allChecked;
        return tmp;
      }));
    }
  }

  public getSelectedChapters() {
    return this.getChapters().filter(chap => chap.selected);
  }

}
