
import { Injectable } from '@angular/core';

import { DataObject } from './objects';
import { StorageService } from './storage.service';
import { SettingsService } from './settings.service';

@Injectable()
export class TagsService {

  private selectedManga: string = "manga-sans-nom";
  private tags: DataObject = {
    follow: {
      icon: "navigate",
      mangaList: "mangaFollowed",
      state: false,
      color: "primary",
      label: "Suivre le manga"
    },
    favoris: {
      icon: "star",
      mangaList: "mangaFavoris",
      state: false,
      color: "warning",
      label: "Ajouter aux favoris"
    },
    saved: {
      icon: "bookmark",
      mangaList: "mangaSaved",
      state: false,
      color: "success",
      label: "Sauvegarder le manga"
    }
  }

  constructor(
    private storageService: StorageService,
    private settingsService: SettingsService
  ) { }

  //Basics Methods
  public iter() {
    let res = [];
    for (let tag in this.tags) {
      res.push(tag);
    }
    return res;
  }

  public getAllTagMangaLists() {
    let res = [];
    for (let tag in this.tags) {
      res.push(this.tags[tag].mangaList);
    }
    return res;
  }

  public reinitTagStates() {
    for (let tag in this.tags) {
      this.tags[tag].state = false;
    }
  }

  public getTagInfo(tag: string, key: string) {
    return this.tags[tag][key];
  }

  public getTagIcon(tag: string) {
    return this.tags[tag].state ? this.tags[tag].icon : `${this.tags[tag].icon}-outline`;
  }

  public getTagFromValue(key: string, value: string) {
    for (let tag in this.tags) {
      if (this.tags[tag][key] === value) {
        return tag;
      }
    }
    return null;
  }

  public async enableTag(tag: string, manga: DataObject) {
    this.tags[tag].state = true;
    await this.storageService.appendToMangaList(this.tags[tag].mangaList, this.selectedManga, manga);
  }

  public async disableTag(tag: string) {
    this.tags[tag].state = false;
    await this.storageService.removeFromMangaList(this.tags[tag].mangaList, this.selectedManga);
  }

  public async getAllTagOfManga(mangaParsedTitle: string) {
    let res = [];
    for (let tag in this.tags) {
      let targetList = await this.storageService.get(this.tags[tag].mangaList);
      if (targetList.includes(mangaParsedTitle)) res.push(tag)
    }
    return res;
  }

  //Specifis Methods
  public async updateTagsStates(mangaParsedTitle: string, forceChecking: boolean = false) {
    if (this.selectedManga !== mangaParsedTitle || forceChecking) {
      this.reinitTagStates();
      this.selectedManga = mangaParsedTitle;
      let mangaLists = await this.storageService.getMangaListWhereMangaIs(mangaParsedTitle);
      for (let tag in this.tags) {
        if (mangaLists.includes(this.tags[tag].mangaList)) {
          this.tags[tag].state = true;
        }
      }
    }
  }

  public async toggleTag(tag: string, manga: DataObject, mangaParsedTitle: string = "") {
    if (this.selectedManga !== "manga-sans-nom" || mangaParsedTitle.length > 0) {
      if (mangaParsedTitle.length > 0 && mangaParsedTitle !== this.selectedManga) {
        await this.updateTagsStates(mangaParsedTitle);
      }
      if (!await this.storageService.arrayContains(this.tags[tag].mangaList, this.selectedManga)) {
        this.enableTag(tag, manga);
      } else {
        this.disableTag(tag);
      }
    }
  }

}
