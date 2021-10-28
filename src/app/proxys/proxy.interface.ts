
import { DataObject } from './../services/objects';

export interface Proxy {

  NB_NEW_CHAPTERS_BEFORE_RECENT_CHAPTERS?: number;

  inProductionURLstart: string;
  inDevURLstart: string;
  currentURLstart: string;

  proxyName: string;

  urlNewChapters: () => string;
  urlMangaInfo: (mangaParsedTitle: string) => string;
  urlChapterPages: (mangaParsedTitle: string, chapter: DataObject) => string;
  urlSearch?: (mangaQuery: string) => (string | DataObject)[];
  /**
   * [url,
   * {
   *  method,
   *  data
   * }]
   */

  scrapeNewChapters: (html: string, callback) => void;
  /**
   * Chapter Structure:
   *
   * chapter = {
   *  parsedTitle,
   *  title,
   *  image,
   *  chapter = { num, title, date, url, source }
   * }
   *
   */
  scrapeMangaInfos: (html: string, callback) => void;
  scrapeChapterPagesURL: (parsedTitle: string, chapter: DataObject, html: string, callback) => void;
  scrapeSearch?: (html: string, callback) => void;
  /**
   * Return:
   * [{
   *  title,
   *  <?>
   * },
   * ...]
   */

}
