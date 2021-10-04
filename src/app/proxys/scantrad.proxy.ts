
import { Proxy } from './proxy.interface';
import { DataObject } from './../services/objects';
import { getLastWordOfSentence } from './../services/utils';

import * as cheerio from 'cheerio';

export class Scantrad implements Proxy {

  inProductionURLstart = "https://scantrad.net";
  inDevURLstart = "/scantrad";
  currentURLstart = "";

  proxyName = "scantrad";

  constructor(inProduction: boolean = false) {
    this.currentURLstart = inProduction ? this.inProductionURLstart : this.inDevURLstart;
  }

  urlNewChapters() {
    return `${this.currentURLstart}/?page`;
  }

  urlMangaInfo(mangaParsedTitle: string) {
    return `${this.currentURLstart}/${mangaParsedTitle}`;
  }

  urlChapterPages(mangaParsedTitle: string, chapter: DataObject) {
    return `${this.currentURLstart}/mangas/${mangaParsedTitle}/${chapter.num}`;
  }

  scrapeNewChaptersSection(html: string, selector: string, callback) {

    let data: DataObject[] = [];

    const $ = cheerio.load(html)
    $(selector).each((index, value) => {
      data.push({})
      const mangaUpdated = cheerio.load(value)
      data[index].parsedTitle = mangaUpdated(".hmi-titre").attr("href");
      data[index].title = mangaUpdated(".hmi-titre span").text().trim();
      data[index].image = mangaUpdated(".hm-image img").attr("data-src");
      data[index].chapter = {
        num: mangaUpdated(".hmi-sub span:first-child").text().trim().split(" ")[1],
        title: mangaUpdated(".hmi-sub span.hm-font").text().trim().substr(1).trim(),
        date: mangaUpdated(".hmr-date").text().trim(),
        url: `${mangaUpdated(".hmi-sub").attr("href")}`,
        source: this.proxyName
      }

    })

    callback(data)

  }

  scrapeNewChapters(html: string, callback) {

    this.scrapeNewChaptersSection(html, ".home-manga.new-chapter", (newestChapter) => {
      this.scrapeNewChaptersSection(html, ".home-manga:not(.new-chapter)", (recentChapter) => {
        let data: DataObject = {
          newestChapters: newestChapter,
          recentChapters: recentChapter
        }

        callback(data)
      })
    })

  }

  scrapeMangaInfos(html: string, callback) {

    let data: DataObject = {
      infos: {},
      chapters: []
    }
    const $ = cheerio.load(html);

    //Infos basics du manga
    data.title = $(".titre").text().trim()
    data.image = $(".ctt-img img").attr("src")

    //Informations du manga
    data.infos["Auteur(s)"] = $(".titre-sub").text().trim();
    data.infos["Autres noms"] = getLastWordOfSentence($(".info .info .sub-i:first-child").text().trim())
    data.infos["Genre(s)"] = [];
    $(".info .info .sub-i:nth-child(0n+2) span").each((index, value) => {
        data.infos["Genre(s)"].push(cheerio.load(value).text().trim())
    });
    data.infos["Statut"] = $(".info .info .sub-i:nth-child(0n+3) span:not(.editeur)").text().trim()
    data.infos["Editeur"] = $(".info .info .sub-i:nth-child(0n+3) span.editeur").text().trim()

    //Chapitres du manga
    $("#chapitres .chapitre").each((index, value) => {
      const chap = cheerio.load(value)
      data.chapters.push({
        num: getLastWordOfSentence(chap(".chl-titre .chl-num").text().trim()),
        title: "",
        date: `depuis ${chap(".chl-date").text().trim()}`,
        url: `${chap(".ch-left").attr("href")}`,
        source: this.proxyName
      })
    })

    callback(data);

  }

  scrapeChapterPagesURL(parsedTitle: string, chapter: DataObject, html: string, callback) {

    const $ = cheerio.load(html);
    let nbPage: number = +$("#selectPg option:last-child").attr("value");
    let urls = [];
    for (let i = 0; i < nbPage; i++) {
      let url = `https://scan-trad.fr/${$(`#scimg-${i}`).attr("data-src")}`
      urls.push(url)
    }
    callback(urls);

  }

}
