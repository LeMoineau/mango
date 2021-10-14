
import { Input } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { MangaInfoPage } from './manga-info.page';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

export abstract class MangaInfoChapterPage extends MangaInfoPage {

  protected checkedChapter: DataObject[] = [];

  constructor(navParams: NavParams) {
    super(navParams);
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

  protected setSelectedChapters(checkedChapter: DataObject[]) {
    this.checkedChapter = checkedChapter;
  }

  public getSelectedChapters() {
    return this.checkedChapter;
  }

}
