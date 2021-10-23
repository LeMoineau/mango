
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavParams } from '@ionic/angular';

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
  public pageName: string = "downloadPage"
  private selectedProxy: string;

  @Output() newMangaInfoLoaded = new EventEmitter<DataObject>();

  constructor(
    private settingsService: SettingsService,
    private mangaService: MangaService,
    private navParams: NavParams
  ) {
    super(navParams);
    this.mangaInfo.synchroniseTab({
      keyName: this.pageName,
      comp: this
    })
  }

  ngOnInit() {
    this.init();
  }

  //Basics Methods
  private init() {
    this.beginWaiting();
    this.selectedProxy = this.settingsService.getParameter("proxyDownloadChapter");
  }

  private updateMangaInfos(proxy: string = this.selectedProxy) {
    this.beginWaiting();
    if (this.manga.chapters.onlineChapters[proxy] === undefined || this.settingsService.getParameter("lowConnectionMode")) {
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
    if (endWaiting) this.endWaiting();
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
    if (!this.settingsService.getParameter("lowConnectionMode")) {
      this.updateMangaInfos(event.selectedProxy);
    }
  }

  private wantToDownloadChapterMethod(event) {
    this.mangaInfo.downloadChapter(event.value);
  }

}
