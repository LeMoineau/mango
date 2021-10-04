
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
  ) { }

  ngOnInit() { }

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
    this.nbSearchingResult = 0;
    this.searchingReturn.emit({ tabIndex: 0, beginNewSearch: true })

    let mangaParsedTitle = this.toParsedFormat(mangaTitle);
    let proxyUse = this.settingsService.getParameter("proxySearch");

    if (proxyUse === "all") {
      for (let proxy of this.proxyService.iter) {
        this.mangaService.getMangaInfos(proxy, mangaParsedTitle, (data) => {
          data.parsedTitle = mangaParsedTitle
          this.sendReponse(data, null, proxy)
        }, (err) => {
          this.sendReponse(null, err, proxy)
        }, false) //false to not save in mangas already loaded
      }
    } else {
      let res = await this.mangaService.getMangaInfos(proxyUse, mangaParsedTitle, (data) => {
        data.parsedTitle = mangaParsedTitle
        this.sendReponse(data, null)
      }, (err) => {
        this.sendReponse(null, err)
      })
    }
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
