
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { DataObject } from './../services/objects';
import { concatener } from './../services/utils';
import { MangaService } from './../services/manga.service';
import { SettingsService } from './../services/settings.service'

import { LoadingModule } from './../modules/loading.module';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
})
export class DownloadComponent extends LoadingModule implements OnInit {

  private currentPageOnline: number = 1;
  private mangaList: DataObject = {
    newestChapters: [],
    recentChapters: []
  }

  private inSearching = false
  private searchingResult = [

  ]

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    public navCtrl: NavController,
    private navParams: NavParams
  ) {
    super();
    navParams.data.synchronisePage("downloadPage", this);
  }

  ngOnInit() {
    if (!this.getLowConnectionMode()) {
      this.getNewMangaChapters();
    }
  }

  //Basics Methods
  getLowConnectionMode() {
    let lowConnectionMode = this.settingsService.getParameter("lowConnectionMode");
    if (!lowConnectionMode && this.currentPageOnline === 1) this.getNewMangaChapters();
    return lowConnectionMode;
  }

  getNewMangaChapters() {
    this.mangaService.getNewMangaChapters(this.currentPageOnline, data => {
      this.mangaList = concatener(this.mangaList, data);
    }, (err) => {

    })
    this.currentPageOnline += 1;
  }

  async refreshMangaList(event) {
    await this.getNewMangaChapters();
    event.target.complete();
  }

  private isInSearching() {
    return this.inSearching;
  }

  private setInSearching(val: boolean) {
    this.inSearching = val;
  }

  public addSearchingResult(result: DataObject) {
    if (result.beginNewSearch) {
      this.searchingResult = []
      this.beginWaiting()
      if (!this.isInSearching()) {
        this.setInSearching(true)
      }
    } else {
      if (result.data !== null && result.data.title.length > 0) {
        delete result.data["chapters"]
        result.data.infos["source"] = result.source
        this.searchingResult.unshift(result);
        console.log(this.searchingResult)
      }

      if (result.lastResearch) {
        this.endWaiting()
      }
    }
  }

}
