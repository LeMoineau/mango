
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

  public addSearchingResult(result: DataObject) {
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
