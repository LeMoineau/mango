
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';

import { concatener } from './utils';
import { DataObject, InitialSettings } from './objects';

@Injectable()
export class StorageService {

  private _storage: Storage | null = null;
  private _storageReady: boolean = false;

  private fieldToCheck: DataObject = {
    allMangas: {},
    mangaFollowed: [],
    mangaFavoris: [],
    mangaSaved: [],
    chaptersDownload: {
      iter: [],
      chapters: []
    },
    settings: InitialSettings
  }

  private mangaLists: string[] = [
    "mangaFollowed", "mangaFavoris", "mangaSaved"
  ]

  constructor(
    private storage: Storage,
    private alertController: AlertController
  ) {
    this.init()
  }

  async init() {
    this._storage = await this.storage.create();

    for (let field in this.fieldToCheck) {
      if (await this.get(field) === null) {
        await this.set(field, this.fieldToCheck[field]);
      }
    }
  }

  public ready(): Promise<{}> {
    return new Promise((resolve) => {
      if (this._storageReady) {
        resolve(this._storageReady);
      } else {
        this.storage.get("mangaSaved").then((data) => {
          this._storageReady = (data !== null)
          resolve(this._storageReady);
        });
      }
    })
  }

  //Basics Methods
  public async set(key: string, val: any) {
    await this.ready();
    await this._storage?.set(key, val);
  }

  public async get(key: string) {
    await this.ready();
    return await this._storage?.get(key);
  }

  public async remove(key: string) {
    await this.ready();
    await this._storage?.remove(key);
  }

  public async arrayContains(keyArr: string, key: string) {
    let arr = await this.get(keyArr);
    return arr.includes(key);
  }

  public async appendInArray(keyArr: string, val: any) {
    if (!await this.arrayContains(keyArr, val)) {
      let arr: any = await this.get(keyArr);
      arr.push(val);
      await this.set(keyArr, arr);
    }
  }

  public async removeFromArray(keyArr: string, key: string) {
    if (await this.arrayContains(keyArr, key)) {
      let arr = await this.get(keyArr);
      let index = arr.indexOf(key);
      arr.splice(index, 1);
      await this.set(keyArr, arr);
    }
  }

  public async objectContains(keyObj: string, key: string) {
    let obj = await this.get(keyObj);
    return (obj[key] !== undefined);
  }

  public async appendInObject(key: string, index: string, val: any) {
    let tmp: DataObject = await this.get(key);
    if (tmp[index] === undefined) tmp[index] = val;
    else tmp[index] = concatener(tmp[index], val);
    await this.set(key, tmp);
  }

  public async removeFromObject(keyObj: string, key: string) {
    if (await this.objectContains(keyObj, key)) {
      let obj = await this.get(keyObj);
      delete obj[key];
      await this.set(keyObj, obj);
    }
  }

  public async getAll() {
    let keys = await this._storage.keys();
    let res = {}
    for (let k of keys) {
      res[k] = await this.get(k);
    }
    return res;
  }

  public async clearAll() {
    await this._storage.clear();
    for (let field in this.fieldToCheck) {
      if (await this.get(field) === null) {
        await this.set(field, this.fieldToCheck[field]);
      }
    }
  }

  public async getInObject(keyObject, key) {
    let obj = await this.get(keyObject);
    if (obj !== null) {
      return obj[key];
    }
  }

  public async setInObject(keyObject, key, val) {
    let obj = await this.get(keyObject);
    if (obj !== null) {
      obj[key] = val;
      await this.set(keyObject, obj);
    }
  }

  //More specialized method
  public async mangaAlreadyViewed(parsedTitle) {
    let allMangas = await this.get("allMangas");
    return (allMangas[parsedTitle] !== undefined);
  }

  private async appendToAllMangas(mangaParsedTitle: string, manga: DataObject) {
    if (manga.chapters !== undefined && manga.chapters.downloadedChapters !== undefined) {
      delete manga.chapters["downloadedChapters"];
    }
    await this.appendInObject("allMangas", mangaParsedTitle, manga);
  }

  public async appendToMangaList(mangaList: string, mangaParsedTitle: string, val: any) {
    if (!await this.mangaAlreadyViewed(mangaParsedTitle)) {
      await this.appendToAllMangas(mangaParsedTitle, val);
    }
    await this.appendInArray(mangaList, mangaParsedTitle);
  }

  public async removeFromMangaList(mangaList: string, mangaParsedTitle: string) {
    await this.removeFromArray(mangaList, mangaParsedTitle);
    for (let mangaL of this.mangaLists) {
      if (await this.arrayContains(mangaL, mangaParsedTitle)) {
        return;
      }
    }
    await this.removeFromObject("allMangas", mangaParsedTitle);
  }

  public async getMangaListWhereMangaIs(mangaParsedTitle: string) {
    let res = []
    for (let mangaList of this.mangaLists) {
      if (await this.arrayContains(mangaList, mangaParsedTitle)) {
        res.push(mangaList);
      }
    }
    return res;
  }

  public async deleteManga(mangaParsedTitle: string) {
    let mangaList = await this.getMangaListWhereMangaIs(mangaParsedTitle);
    for(let list of mangaList) {
      await this.removeFromMangaList(list, mangaParsedTitle);
    }
  }

  public async getMangaInfos(mangaParsedTitle: string) {
    let allMangas = await this.get("allMangas");
    return allMangas[mangaParsedTitle];
  }

  public async appendChapterDownload(mangaParsedTitle: string, chapterInfos: DataObject) {
    let chaptersDownload = await this.get("chaptersDownload");
    if (!chaptersDownload.iter.includes(mangaParsedTitle)) {
      chaptersDownload.iter.push(mangaParsedTitle);
      chaptersDownload.chapters[mangaParsedTitle] = [];
    }
    chaptersDownload.chapters[mangaParsedTitle].push(chapterInfos);
    await this.set("chaptersDownload", chaptersDownload);
    await this.modifyManga(mangaParsedTitle);
  }

  public async removeChapterDownload(mangaParsedTitle: string, chapterInfos: DataObject) {
    let chaptersDownload = await this.get("chaptersDownload");
    if (chaptersDownload.iter.includes(mangaParsedTitle)) {
      const critereSelection = ["num", "source"];
      let index = chaptersDownload.chapters[mangaParsedTitle].find(c => {
        for (let critere of critereSelection) {
          if (c[critere] !== chapterInfos[critere]) return false;
        }
        return true;
      })
      chaptersDownload.chapters[mangaParsedTitle].splice(index, 1);
      if (chaptersDownload.chapters[mangaParsedTitle].length <= 0) {
        index = chaptersDownload.iter.indexOf(mangaParsedTitle);
        chaptersDownload.iter.splice(index, 1);
      }
    }
    await this.set("chaptersDownload", chaptersDownload);
  }

  public async getChaptersDownload(mangaParsedTitle: string) {
    let chaptersDownload = await this.get("chaptersDownload");
    return chaptersDownload.chapters[mangaParsedTitle];
  }

  public async updateMangaInfos(mangaParsedTitle: string, updatedInfos: DataObject) {
    let manga = await this.getMangaInfos(mangaParsedTitle);
    if (manga !== undefined) {
      manga.infos = updatedInfos
      await this.setInObject("allMangas", mangaParsedTitle, manga);
      await this.modifyManga(undefined, manga);
    }
  }

  public async modifyManga(mangaParsedTitle?: string, manga?: DataObject) {
    if (await this.getInObject("settings", "autoSaveMangas")) {
      if (manga === undefined) {
        if (mangaParsedTitle === undefined) {
          return;
        }
        manga = await this.getMangaInfos(mangaParsedTitle);
      }
      await this.appendToMangaList("mangaSaved", manga.parsedTitle, manga);
    }
  }

}

/**

  <title> = parsedTitle

  storage = {
    allMangas: {
      <title>: {}
    }
    mangaFollowed: [
      <title>, <title>
    ],
    mangaFavoris: [
      <title>, <title>
    ],
    mangaSaved: [
      <title>, <title>
    ],
    chaptersDownload: {
      iter: [
        <title>, <title>
      ],
      chapters: [
        <title>: [
          {
            num: 1,
            extension: "png",
            fileName: "dr-stone-chapitre-207-1",
            source: "scantrad"
            pages: {0: {}, ...}
          }
        ]
      }
    },
    settings: {

    }
  }

 */
