
import { Input, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { NavParams } from '@ionic/angular';

import { MangaInfoPage } from './manga-info.page';
import { ChapterListComponent } from './../chapter-list/chapter-list.component';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

export abstract class MangaInfoChapterPage extends MangaInfoPage implements AfterViewInit {

  @ViewChildren(ChapterListComponent) private chapterLists: QueryList<ChapterListComponent>;
  private readyToDisableCheckMode: boolean = false;

  protected checkedChapter: DataObject[] = [];

  constructor(navParams: NavParams) {
    super(navParams);
  }

  ngAfterViewInit() {
    this.setReadyToDisableCheckMode(true);
  }

  private setReadyToDisableCheckMode(val: boolean) {
    this.readyToDisableCheckMode = val;
  }

  public isReadyToDisableCheckMode() {
    return this.readyToDisableCheckMode;
  }

  public setCheckModeInChapterListChildren(val: boolean = false) {
    for (let chapterList of this.chapterLists) {
      chapterList.checkMode = val;
    }
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
