
import { Injectable } from '@angular/core';

import axios from 'axios';

import { SettingsService } from './settings.service';
import { DataObject } from './objects';
import { DownloadService } from './download.service';
import { StorageService } from './storage.service';
import { concatener } from './utils';
import { ProxyService } from './../services/proxy.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable()
export class MangaService {

  private mangaInfosAlreadyLoaded: DataObject = {}

  constructor(
    private settingsService: SettingsService,
    private downloadService: DownloadService,
    private storageService: StorageService,
    private proxyService: ProxyService,
    private http: HTTP
  ) { }

  //Basics Methods
  public isMangaInfosAlreadyLoaded(proxy: string, mangaParsedTitle: string) {
    return (this.mangaInfosAlreadyLoaded[proxy] !== undefined && this.mangaInfosAlreadyLoaded[proxy][mangaParsedTitle] !== undefined)
  }

  public addMangaInfosLoaded(proxy: string, mangaParsedTitle: string, mangaInfos: DataObject) {
    if (this.mangaInfosAlreadyLoaded[proxy] === undefined) {
      this.mangaInfosAlreadyLoaded[proxy] = {};
    }
    this.mangaInfosAlreadyLoaded[proxy][mangaParsedTitle] = mangaInfos;
  }

  public getMangaInfosLoaded(proxy: string, mangaParsedTitle: string) {
    return this.mangaInfosAlreadyLoaded[proxy] !== undefined ? this.mangaInfosAlreadyLoaded[proxy][mangaParsedTitle] : null;
  }

  public resetMangaInfosAlreadyLoaded() {
    this.mangaInfosAlreadyLoaded = {};
  }

  private requestWeb(url, callback, callbackErr, options: any = { method: 'get' }, sendAll: boolean = false) {
    if (this.proxyService.inProduction) {
      this.http.sendRequest(url, options).then((res) => {
        callback(!sendAll ? res.data : res)
      }).catch((err) => {
        callbackErr(err)
      })
    } else {
      axios[options.method](url, options.data).then((res) => {
        callback(!sendAll ? res.data : res);
      }).catch(err => {
        callbackErr(err)
      })
    }
  }

  //Specifics Methods
  public getNewMangaChapters(page: number = 1, callback, callbackErr) {
    const proxyUse = this.settingsService.getParameter("proxyNewChapter");
    let proxy = this.proxyService.getProxy(proxyUse);
    this.requestWeb(`${proxy.urlNewChapters()}=${page}`, (html) => {
      proxy.scrapeNewChapters(html, (data) => {
        callback(data);
      })
    }, callbackErr)
  }

  public getMangaInfos(proxyName: string, mangaParsedTitle: string, callback, callbackErr, saveInMangaAlreadyLoaded: boolean = true) {
    let proxy = this.proxyService.getProxy(proxyName);
    if (!this.isMangaInfosAlreadyLoaded(proxyName, mangaParsedTitle)) {
      this.requestWeb(`${proxy.urlMangaInfo(mangaParsedTitle)}`, (html) => {
        proxy.scrapeMangaInfos(html, (mangaInfos) => {
          if (saveInMangaAlreadyLoaded) this.addMangaInfosLoaded(proxyName, mangaParsedTitle, mangaInfos);
          callback(mangaInfos);
        })
      }, callbackErr)
    } else {
      callback(this.getMangaInfosLoaded(proxyName, mangaParsedTitle));
    }
  }

  public getNewMangaInfo(mangaParsedTitle: string, callback, callbackErr) {
    let proxyUse = this.settingsService.getParameter("proxyNewChapter");
    this.getMangaInfos(proxyUse, mangaParsedTitle, callback, callbackErr);
  }

  public getAllMangaInfo(mangaParsedTitle: string, callback, callbackErr) {
    let proxyUse = this.settingsService.getParameter("proxyDownloadChapter");
    this.getMangaInfos(proxyUse, mangaParsedTitle, callback, callbackErr);
  }

  public async downloadChapter(parsedTitle: string, chapter: DataObject, callbackProgress = (res) => {console.log(res)}) {
    let proxyUse = chapter.source;
    let proxy = this.proxyService.getProxy(proxyUse);
    this.requestWeb(`${proxy.urlChapterPages(parsedTitle, chapter)}`, async (res) => {
      proxy.scrapeChapterPagesURL(parsedTitle, chapter, res, async (urls) => {
        chapter.pages = {
          length: urls.length
        }
        callbackProgress({
          action: 'length',
          chapter: chapter,
          length: urls.length
        })
        for (let url of urls) {
          if (urls.indexOf(url) === 1) console.log(`requested page 1 at ${new Date()} !`)
          await this.requestWeb(url, async (res) => {
            let page = urls.indexOf(url);
            callbackProgress({
              action: `request`,
              chapter: chapter,
              finish: true,
              page: page
            })
            await this.downloadService.downloadChapterPage(parsedTitle, `chapitre-${chapter.num}-${page+1}`, res, url, async (data) => {
              let index = urls.indexOf(url);
              if (data.test !== undefined) {
                callbackProgress({
                  action: `${data.test}`,
                  chapter: chapter,
                  finish: true,
                  page: index
                })
                return;
              }
              data.nbPage = index;
              chapter.pages[index] = data;
              callbackProgress({
                action: 'download',
                chapter: chapter,
                finish: true,
                page: index
              })
              let all_dl = true
              for (let i = 0; i<chapter.pages.length; i++) {
                if (chapter.pages[i] === undefined) all_dl = false
              }
              if (all_dl) {
                await this.storageService.appendChapterDownload(parsedTitle, chapter);
                callbackProgress({
                  action: 'end',
                  chapter: chapter,
                  finish: true,
                  page: index
                })
              }
            })
          }, (err) => {
            console.log(err)
          }, {
            method: 'get',
            responseType: 'blob'
          })
        }
      })
    }, (err) => {
      console.log(err);
    });
  }

  async deleteDownloadChapter(parsedTitle: string, chapter: DataObject) {
    await this.downloadService.removeChapter(parsedTitle, chapter);
    await this.storageService.removeChapterDownload(parsedTitle, chapter);
  }

  async deleteAllChapters() {
    let downloadedChapters = await this.storageService.get("chaptersDownload");
    console.log(downloadedChapters)
    for (let manga of downloadedChapters.iter) {
      for (let chapter of downloadedChapters.chapters[manga]) {
        await this.deleteDownloadChapter(manga, chapter);
      }
      console.log(downloadedChapters)
    }
  }

  async searchingMangas(proxy: string, mangaParsedTitle: string, callback: Function, callbackErr: Function) {
    let currentProxy = this.proxyService.getProxy(proxy);
    let searchUrl = currentProxy.urlSearch(mangaParsedTitle)
    //console.log(searchUrl)
    let res = await this.requestWeb(
      searchUrl[0],
      (data) => {
        currentProxy.scrapeSearch(data, (res) => {
          callback(res)
        })
      }, (err) => {
        callbackErr(err)
      },
      searchUrl[1]
    )
  }

}
