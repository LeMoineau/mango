
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

  constructor(
    private storageService: StorageService,
    private modalService: ModalService,
    private mangaService: MangaService
  ) {
    super();
  }

  ngOnInit() {
    this.init();
  }

  //Basics Methods
  private async init() {
    let downloadedChapters = await this.storageService.getChaptersDownload(this.manga.parsedTitle);
    if (downloadedChapters !== undefined) {
      this.addDownloadedChapters(downloadedChapters);
    }
  }

  public addDownloadedChapters(chapters: DataObject[]) {
    chapters.map((chap) => {
      let tmp = chap;
      tmp.selected = false;
      return tmp
    })
    if (this.getChapters() !== undefined && this.manga.chapters.downloadedChapters !== chapters) {
      this.manga.chapters.downloadedChapters = this.manga.chapters.downloadedChapters.concat(chapters || []);
    }
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

}
