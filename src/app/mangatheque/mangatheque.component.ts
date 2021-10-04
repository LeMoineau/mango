
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { MangaInfoComponent } from './../manga-info/manga-info.component';

import { DataObject } from './../services/objects';
import { MangaService } from './../services/manga.service';
import { StorageService } from './../services/storage.service';
import { SettingsService } from './../services/settings.service';
import { ModalService } from './../services/modal.service';
import { TagsService } from './../services/tags.service';

@Component({
  selector: 'app-mangatheque',
  templateUrl: './mangatheque.component.html',
  styleUrls: ['./mangatheque.component.scss'],
})
export class MangathequeComponent implements OnInit {

  private allMangas: DataObject = {};
  private toShowMangas: DataObject[] = [];
  private filtersEnable: string[] = [];
  private mangasByFilter: DataObject = {};

  private filtering: boolean = false;

  private filterButtonColor = {
    mangaFollowed: "light",
    mangaFavoris: "light",
    mangaSaved: "light"
  }

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService,
    private modalService: ModalService,
    private tagsService: TagsService,
    public navCtrl: NavController,
    private navParams: NavParams
  ) {
    navParams.data.synchronisePage("mangatheque", this)
  }

  async ngOnInit() {
    await this.init();
  }

  async init() {
    await this.updateAllMangaList();
    this.clearFilter();
  }

  private async updateAllMangaList() {
    this.allMangas = await this.storageService.get("allMangas");
    let tagMangaLists = this.tagsService.getAllTagMangaLists();

    for (let mangaList of tagMangaLists) {
      let mangaByFilter = await this.storageService.get(mangaList);
      this.mangasByFilter[mangaList] = mangaByFilter;
    }

    if (this.filtersEnable.length > 0) {
      for (let filter of this.filtersEnable) {
        this.enableFilter(filter);
      }
    } else {
      this.showAllMangas()
    }
  }

  private showManga(mangaTitle: string, filterName: string) {
    this.toShowMangas.push({
      mangaParsedTitle: this.allMangas[mangaTitle].parsedTitle,
      fromFilter: [filterName]
    });
  }

  private showAllMangas() {
    this.toShowMangas = [];
    for (let mangaTitle in this.allMangas) {
      this.showManga(mangaTitle, 'allMangas');
    }
  }

  private getAllMangas(mangaTitle): DataObject {
    if (this.allMangas[mangaTitle] !== undefined) {
      return this.allMangas[mangaTitle];
    } else {
      return {};
    }
  }

  private enableFilter(filterName: string) {
    if (!this.filtering) {
      this.filtering = true;
      this.toShowMangas = [];
    }

    if (!this.filtersEnable.includes(filterName)) {
      this.filtersEnable.push(filterName)
    }

    for (let mangaParsedTitle of this.mangasByFilter[filterName]) {
      let mangaAlreadyIn = this.toShowMangas.find(m => m.mangaParsedTitle === mangaParsedTitle)
      if (mangaAlreadyIn !== undefined && !mangaAlreadyIn.fromFilter.includes(filterName)) {
        mangaAlreadyIn.fromFilter.push(filterName)
      } else if (mangaAlreadyIn === undefined) {
        this.toShowMangas.push({
          mangaParsedTitle: mangaParsedTitle,
          fromFilter: [filterName]
        })
      }
    }

    this.colorFilterButton(filterName)
  }

  private async disableFilter(filterName: string) {

    if (this.filtersEnable.includes(filterName)) {
      let indice = this.filtersEnable.findIndex(f => f === filterName);
      this.filtersEnable.splice(indice, 1);

      if (this.filtersEnable.length <= 0) {
        this.clearFilter();
        return;
      }

      this.toShowMangas = [];
      for (let filter of this.filtersEnable) {
        this.enableFilter(filter)
      }

      this.colorFilterButton(filterName)
    }
  }

  private toggleFilter(filterName: string) {
    if (!this.filtersEnable.includes(filterName)) {
      this.enableFilter(filterName)
    } else {
      this.disableFilter(filterName)
    }
  }

  clearFilter() {
    this.filtering = false;
    this.filtersEnable = []
    this.showAllMangas()

    for (let filter in this.mangasByFilter) {
      this.colorFilterButton(filter);
    }
  }

  colorFilterButton(filterName) {
    let tag = this.tagsService.getTagFromValue('mangaList', filterName)
    if (tag !== null) {
      if (!this.filtersEnable.includes(filterName)) {
        this.filterButtonColor[filterName] = "light";
        document.getElementById(`${tag}-button`).style["color"] = "black";
      } else {
        this.filterButtonColor[filterName] = this.tagsService.getTagInfo(tag, 'color');
        document.getElementById(`${tag}-button`).style["color"] = "white";
      }
    }
  }

  async refreshMangaList(event) {
    await this.updateAllMangaList();
    event.target.complete()
  }

  async mangaInfoClose(res) {
    if (res.data !== undefined) {
      if (res.data.mangaDeleted === true) {
        await this.storageService.deleteManga(res.data.mangaParsedTitle);
      }
      await this.updateAllMangaList();
    }
  }

}
