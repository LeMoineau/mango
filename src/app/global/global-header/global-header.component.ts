
import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { DataObject } from './../../services/objects';
import { SettingsService } from './../../services/settings.service';
import { MangaService } from './../../services/manga.service';
import { ProxyService } from './../../services/proxy.service';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss'],
})
export class GlobalHeaderComponent implements OnInit {

  @Input() title: string = "Blank";
  @Input() hideSearch: boolean = false;
  private _appContainer;

  @Output() searchingReturn = new EventEmitter();
  private nbSearchingResult: number = 0;

  @ViewChild('searchbar') searchbar;

  private selectedTab: number = 1;
  private titles: DataObject[] = [
    {
      title: "Nouvelles sorties",
      inputSearchBar: "",
      handler: async (mangaTitle) => {
        this.searchOnlineMangas(mangaTitle)
      }
    },
    {
      title: "Ma Mangathèque",
      inputSearchBar: "",
      handler: (mangaTitle) => {
        this.searchInMangatheque(mangaTitle)
      }
    },
    {
      title: "Paramètres",
      inputSearchBar: "",
      handler: (mangaTitle) => {
        this.searchInSettings(mangaTitle)
      }
    }
  ]

  constructor(
    private settingsService: SettingsService,
    private mangaService: MangaService,
    private proxyService: ProxyService
  ) {

  }

  ngOnInit() { }

  //Getter & Setter
  @Input() set appContainer(val: any) {
    this._appContainer = val
    this.appContainer.synchroniseTab({
      keyName: "globalHeader",
      comp: this
    })
  }

  get appContainer() {
    return this._appContainer;
  }

  //Basics Methods
  public setSelectedTab(index: number) {
    this.selectedTab = index;
  }

  private getSelectedTitle() {
    return this.titles[this.selectedTab];
  }

  private toParsedFormat(mangaTitle: string) {
    return mangaTitle.toLowerCase()
      .replace(/\s|_|\(|\)/g, "-")
      .normalize("NFD").replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .split(" ")
      .join("-")
  }

  //Specefics Methods
  public async search() {
    await this.getSelectedTitle().handler(this.getSelectedTitle().inputSearchBar)
  }

  private async searchOnlineMangas(mangaTitle: string) {
    this.appContainer.getTab("downloadPage").beginWaiting();

    let mangaParsedTitle = this.toParsedFormat(mangaTitle);
    let proxyUse = this.settingsService.getParameter("proxySearch");

    if (proxyUse === "all") {
      for (let proxy of this.proxyService.iter) {
        await this.treatSearching(proxy, mangaParsedTitle)
      }
    } else {
      await this.treatSearching(proxyUse, mangaParsedTitle)
    }

    this.appContainer.getTab("downloadPage").endWaiting();
  }

  private async treatSearching(proxy, mangaParsedTitle) {
    await this.mangaService.searchingMangas(proxy, mangaParsedTitle, (res) => {
      this.appContainer.getTab("downloadPage").addSearchingResult(res);
    }, (err) => {
      console.log(err)
    })
  }

  private sendReponse(data: DataObject = null, err = null, source = this.settingsService.getParameter("proxySearch")) {
    this.nbSearchingResult += 1;
    this.searchingReturn.emit({
      tabIndex: this.selectedTab,
      data: data,
      source: source,
      lastResearch: this.settingsService.getParameter("proxySearch") === "all" ?
        this.nbSearchingResult >= this.proxyService.iter.length : true,
      err: err
    })
  }

  private searchInMangatheque(mangaTitle: string) {
    console.log("mangatheque")
  }

  private searchInSettings(mangaTitle: string) {
    console.log("settings")
  }

}
