
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { MangaInfoChapterPage } from './../manga-info.chapter-page';

import { DataObject, MangaStructure } from './../../services/objects';
import { SettingsService } from './../../services/settings.service';
import { MangaService } from './../../services/manga.service';
import { copyStructureOf } from './../../services/utils';

@Component({
  selector: 'manga-info-download-page',
  templateUrl: './manga-info-download-page.component.html',
  styleUrls: ['./manga-info-download-page.component.scss'],
})
export class MangaInfoDownloadPageComponent extends MangaInfoChapterPage implements OnInit {

  //private manga: DataObject[]
  private selectedProxy: string;

  @Output() newMangaInfoLoaded = new EventEmitter<DataObject>();

  constructor(
    private settingsService: SettingsService,
    private mangaService: MangaService
  ) {
    super();
  }

  ngOnInit() {
    this.init();
    console.log(this.noChapters())
  }

  //Basics Methods
  private init() {
    this.beginWaiting();
    this.selectedProxy = this.settingsService.getParameter("proxyDownloadChapter");
  }

  private updateMangaInfos(proxy: string = this.selectedProxy) {
    this.beginWaiting();
    console.log("coucou")
    if (this.manga.chapters.onlineChapters[proxy] === undefined || this.settingsService.getParameter("lowConnectionMode")) {
      console.log("cocou2")
      this.addOnlineChapters(proxy, [], false)
      this.mangaService.getMangaInfos(proxy, this.manga.parsedTitle, (data) => {
        console.log(data)
        this.addOnlineChapters(proxy, data.chapters);
        this.newMangaInfoLoaded.emit({ mangaLoaded: data });
      }, (err) => {
        this.addOnlineChapters(proxy, []);
      })
    } else {
      this.addOnlineChapters(proxy, this.manga.chapters.onlineChapters[proxy]);
    }
  }

  public addOnlineChapters(proxy: string, onlineChapters: DataObject[], endWaiting: boolean = true) {
    this.selectedProxy = proxy;
    this.setChapters(onlineChapters)
    console.log(this.manga)
    if (endWaiting) this.endWaiting();
  }

  public dismiss(): void {
    this.manga.chapters.onlineChapters = {};
  }

  //Inherit Methods
  protected getChapters(): DataObject[] {
    return this.manga.chapters.onlineChapters !== undefined ? this.manga.chapters.onlineChapters[this.selectedProxy] : [];
  }

  protected setChapters(val) {
    if (!this.hasChapters()) {
      this.manga.chapters.onlineChapters = {};
    }
    this.manga.chapters.onlineChapters[this.selectedProxy] = val;
  }

  //Specifics Methods
  private proxySelectedChange(event) {
    this.selectedProxy = event.selectedProxy;
    console.log(this.manga)
    console.log(this.selectedProxy)
    console.log(this.noChapters())
    console.log(this.InWaiting())
    if (!this.settingsService.getParameter("lowConnectionMode")) {
      this.updateMangaInfos(event.selectedProxy);
    }
  }

}
