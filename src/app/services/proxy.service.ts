
import { Injectable } from '@angular/core';

import { DataObject } from './objects';

import { Proxy } from './../proxys/proxy.interface';
import { Scantrad } from './../proxys/scantrad.proxy';
import { ScanvfNet } from './../proxys/scanvf-net.proxy';
import { ScanvfCC } from './../proxys/scanvf-cc.proxy';

@Injectable()
export class ProxyService {

  public inProduction: boolean = false;

  public iter: string[] = ["scantrad", "scanvfNet", "scanvfCC"]

  private scantrad: Proxy;
  private scanvfNet: Proxy;
  private scanvfCC: Proxy;
  //scan-cc.net
  //mangascan.cc
  //lelscans.net
  //mangaplus.shuesha

  constructor() {
    this.scantrad = new Scantrad(this.inProduction);
    this.scanvfNet = new ScanvfNet(this.inProduction);
    this.scanvfCC = new ScanvfCC(this.inProduction);
  }

  public getProxy(proxyName: string): Proxy {
    if (this.iter.includes(proxyName)) {
      return this[proxyName];
    } else {
      console.log(`Connais pas proxy: "${proxyName}"`);
      return null;
    }
  }

  public scrapeNewChapters(proxy: string, html: string, callback) {
    let scrapeMethodToUse = this[proxy].scrapeNewChapters;
    scrapeMethodToUse(html, (data) => {
      callback(data)
    })
  }

  public scrapeMangaInfos(proxy: string, html: string, callback) {
    let scrapeMethodToUse = this[proxy].scrapeMangaInfos;
    scrapeMethodToUse(html, (data) => {
      callback(data)
    })
  }

  public scrapeChapterPagesURL(parsedTitle: string, chapter: DataObject, html: string, callback) {
    let scrapeMethodToUse = this[chapter.source].scrapeChapterPagesURL;
    scrapeMethodToUse(parsedTitle, chapter, html, (data) => {
      callback(data)
    });
  }

}
