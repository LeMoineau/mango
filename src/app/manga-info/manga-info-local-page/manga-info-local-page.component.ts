
import { Component, OnInit, Input } from '@angular/core';

import { MangaInfoChapterPage } from './../manga-info.chapter-page';
import { MangaReaderComponent } from './../../manga-reader/manga-reader.component';

import { DataObject, MangaStructure } from './../../services/objects';
import { StorageService } from './../../services/storage.service';
import { ModalService } from './../../services/modal.service';
import { copyStructureOf } from './../../services/utils';
import { MangaService } from './../../services/manga.service';

@Component({
  selector: 'manga-info-local-page',
  templateUrl: './manga-info-local-page.component.html',
  styleUrls: ['./manga-info-local-page.component.scss'],
})
export class MangaInfoLocalPageComponent extends MangaInfoChapterPage implements OnInit {

  //private manga: DataObject[]

  private inDownloadingChapters: DataObject[] = [];

  constructor(
    private storageService: StorageService,
    private modalService: ModalService,
    private mangaService: MangaService
  ) {
    super();
  }

  async ngOnInit() {
    await this.updateDownloadedChapters();
  }

  //Basics Methods
  public async updateDownloadedChapters() {
    this.manga.chapters.downloadedChapters = await this.storageService.getChaptersDownload(this.manga.parsedTitle);
  }

  public dismiss(): void {
    this.manga.chapters.downloadedChapters = [];
  }

  //Inherit Methods
  protected getChapters(): DataObject[] {
    return this.manga.chapters.downloadedChapters;
  }

  protected setChapters(val) {
    this.manga.chapters.downloadedChapters = val;
  }

  //Specifics Methods
  public addInDownloadingChapter(chapter: DataObject, length: number) {
    if (!this.inDownloadingChapters.includes(chapter)) {
      this.inDownloadingChapters.push({
        title: chapter.title,
        num: chapter.num,
        length: length*2,
        currentLength: 0,
        progress: 0,
        lastStep: "initialisation"
      })
      console.log(this.inDownloadingChapters)
    }
  }

  public progressInDownloadingChapter(progress: DataObject) {
    let target = this.inDownloadingChapters.find(c => c.title === progress.chapter.title && c.num === progress.chapter.num);
    if (target !== undefined) {
      target.currentLength += 1;
      target.progress = Math.round(target.currentLength / target.length * 100);
      target.lastStep = `${progress.action} of page ${progress.page || '???'}`;
    }
  }

  public async removeInDownloadingChapter(chapter: DataObject) {
    let targetIndex = this.inDownloadingChapters.findIndex(c => c.title === chapter.title && c.num === chapter.num);
    if (targetIndex !== -1) {
      this.inDownloadingChapters.splice(targetIndex, 1);
      await this.updateDownloadedChapters();
    }
  }

}
