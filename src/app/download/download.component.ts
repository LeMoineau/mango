
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { DataObject } from './../services/objects';
import { concatener, removeUndefinedValues } from './../services/utils';
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

  private searchingResult = []

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    public navCtrl: NavController,
    private navParams: NavParams
  ) {
    super();
    navParams.get("appContainer").synchroniseTab({
      keyName: "downloadPage",
      comp: this
    })
  }

  async ngOnInit() {
    await this.settingsService.ready();
    if (!this.getLowConnectionMode()) {
      await this.getNewMangaChapters();
    }
  }

  //Basics Methods
  getLowConnectionMode() {
    let lowConnectionMode = this.settingsService.getParameter("lowConnectionMode");
    return lowConnectionMode;
  }

  async getNewMangaChapters() {
    await this.mangaService.getNewMangaChapters(this.currentPageOnline, data => {
      for (let key in data) {
        data[key] = removeUndefinedValues(data[key]);
      }
      console.log(data)
      this.mangaList = concatener(this.mangaList, data);
    }, (err) => {
      console.log(err)
    })
    this.currentPageOnline += 1;
  }

  public addSearchingResult(res: DataObject[]) {
    for (let manga of res) {
      if (!this.searchingResult.find(m => m.parsedTitle === manga.parsedTitle)) {
        this.searchingResult.push(manga)
      }
    }
  }

  private resetSearchingResult() {
    this.searchingResult = [];
  }

  private async resetNewMangaChapters() {
    this.currentPageOnline = 1;
    this.mangaList = {
      newestChapters: [],
      recentChapters: []
    }
    if (!this.getLowConnectionMode()) {
      await this.getNewMangaChapters();
    }
  }

}
