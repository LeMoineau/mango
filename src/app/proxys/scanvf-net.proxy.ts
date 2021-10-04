
import { Proxy } from './proxy.interface';
import { DataObject } from './../services/objects';
import { getLastWordOfSentence, getLastOfSplit } from './../services/utils';

import * as cheerio from 'cheerio';

export class ScanvfNet implements Proxy {

  NB_NEW_CHAPTERS_BEFORE_RECENT_CHAPTERS = 3;

  inProductionURLstart = "https://scan-vf.net";
  inDevURLstart = "/scanvfNet";
  currentURLstart = "";

  proxyName = "scanvfNet";

  constructor(inProduction: boolean = false) {
    this.currentURLstart = inProduction ? this.inProductionURLstart : this.inDevURLstart;
  }

  urlNewChapters() {
    return `${this.currentURLstart}/latest-release?page`;
  }

  urlMangaInfo(mangaParsedTitle: string) {
    return `${this.currentURLstart}/${mangaParsedTitle}`;
  }

  urlChapterPages(mangaParsedTitle: string, chapter: DataObject) {
    return `${this.currentURLstart}/${mangaParsedTitle}/chapitre-${chapter.num}`;
  }

  scrapeNewChapters(html: string, callback) {

    let data: DataObject = {
      newestChapters: [],
      recentChapters: []
    }
    const $ = cheerio.load(html);
    let nbDateDifferente = 0;
    let lastDate = "";

    $(".manga-item").each((index, value) => {

      const $2 = cheerio.load(value);
      $2(".manga-chapter").each((index2, value2) => {

        const $3 = cheerio.load(value2);
        let chapter: DataObject = {};

        chapter.parsedTitle = getLastOfSplit($2(".manga-heading a").attr("href"), "/");
        chapter.title = $2(".manga-heading a").text().trim();
        chapter.image = `https://www.scan-vf.net/uploads/manga/${chapter.parsedTitle}/cover/cover_250x350.jpg`;
        let longTitle = $3(".events-subtitle a").text().trim();
        chapter.chapter = {
          num: longTitle.split(".")[0].split("#")[1].trim(),
          title: longTitle.split(".")[1].trim(),
          date: $2("small.pull-right").text().trim(),
          url: $3(".events-subtitle a").attr("href"),
          source: this.proxyName
        }

        if (chapter.chapter.date !== lastDate) {
          lastDate = chapter.chapter.date;
          nbDateDifferente += 1;
        }

        if (nbDateDifferente > this.NB_NEW_CHAPTERS_BEFORE_RECENT_CHAPTERS) {
          data.recentChapters.push(chapter);
        } else {
          data.newestChapters.push(chapter);
        }
      })
    })

    callback(data);
  };

  scrapeMangaInfos(html: string, callback) {

    let data: DataObject = {
      infos: {},
      chapters: []
    };
    const $ = cheerio.load(html);

    //Infos basics du manga
    data.title = $(".col-sm-12 > h2.widget-title:first-child").text().trim()
    data.image = $(".img-responsive").attr("src")

    //Informations du manga
    $(".dl-horizontal dt").each((index, value) => {
      let key = cheerio.load(value).text().trim();
      data.infos[key] = "to find"
    });
    let vals = $(".dl-horizontal dd")
    let compteur = 0;
    for (let key in data.infos) {
      data.infos[key] = cheerio.load(vals[compteur]).text().trim();
      compteur += 1;
    }

    //Chapitres du manga
    $(".chapters li").each((index, value) => {
      let cheerioValue = cheerio.load(value);
      data.chapters.push({
        num: getLastWordOfSentence(cheerioValue(".chapter-title-rtl a").text().trim()),
        title: cheerioValue(".chapter-title-rtl *:last-child").text().trim(),
        date: cheerioValue(".date-chapter-title-rtl").text().trim(),
        url: cheerioValue(".chapter-title-rtl a:first-child").attr("href"),
        source: this.proxyName
      });
    })

    callback(data);
  };

  scrapeChapterPagesURL(parsedTitle: string, chapter: DataObject, html: string, callback) {

    const $ = cheerio.load(html);
    let urls = [];
    $("#all .img-responsive").each((index, value) => {
      let imgResp = cheerio.load(value);
      let url = value.attribs["data-src"].trim();
      url = `${this.currentURLstart}/${url.split("scan-vf.net/")[1]}`;
      urls.push(url);
    })

    callback(urls);
  };

}
