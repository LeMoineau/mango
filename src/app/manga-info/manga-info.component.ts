
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';

import { MangaInfoMenuComponent } from './manga-info-menu/manga-info-menu.component';
import { MangaInfoLandingPageComponent } from './manga-info-landing-page/manga-info-landing-page.component';
import { MangaInfoLocalPageComponent } from './manga-info-local-page/manga-info-local-page.component';
import { MangaInfoDownloadPageComponent } from './manga-info-download-page/manga-info-download-page.component';
import { MangaInfoChapterPage } from './manga-info.chapter-page';

import { concatener, copyStructureOf } from './../services/utils';
import { MangaService } from './../services/manga.service';
import { SettingsService } from './../services/settings.service';
import { StorageService } from './../services/storage.service';
import { DataObject, MangaStructure, getRandomNotFoundMessage } from './../services/objects';
import { ModalService } from './../services/modal.service';

@Component({
  selector: 'app-manga-info',
  templateUrl: './manga-info.component.html',
  styleUrls: ['./manga-info.component.scss'],
})
export class MangaInfoComponent implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild(MangaInfoLandingPageComponent) landingPage: MangaInfoLandingPageComponent;
  @ViewChild(MangaInfoLocalPageComponent) localPage: MangaInfoLocalPageComponent;
  @ViewChild(MangaInfoDownloadPageComponent) downloadPage: MangaInfoDownloadPageComponent;

  private baseActiveSlide: number = 0;
  private slidesManager: DataObject = {
    screenSize: "100vh",
    slidesIds: ["information-slide", "localSection-slide", "onlineSection-slide"],
    pageCharged: false
  }

  private showDeleteMangaOption: boolean = false;

  public manga: DataObject = {}

  constructor(
    private modalController: ModalController,
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private storageService: StorageService,
    private modalService: ModalService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.init();
  }

  private waitViewChildInit(viewChild: string) {
    return new Promise((resolve) => {
      if (this[viewChild] !== undefined) {
        resolve(viewChild);
      } else {
        let interval = setInterval(() => {
          if (this[viewChild] !== undefined) {
            clearInterval(interval);
            resolve(viewChild);
          }
        }, 500)
      }
    })
  }

  private async init() {
    this.manga = concatener(this.manga, {...MangaStructure});

    await this.waitViewChildInit("downloadPage");
    await this.waitViewChildInit("landingPage");

    //Check known mangas in allMangas storage
    const knowMangaInformation = await this.storageService.getMangaInfos(this.manga.parsedTitle);
    if (knowMangaInformation !== undefined) {
      this.landingPage.updateInfos(knowMangaInformation, !this.settingsService.getParameter("lowConnectionMode"));
    }

    //Check online manga informations for the proxy 'proxyDownloadChapter'
    let proxy = this.settingsService.getParameter('proxyDownloadChapter');
    if (!this.settingsService.getParameter("lowConnectionMode")) {
      this.mangaService.getMangaInfos(proxy, this.manga.parsedTitle, (data) => {
        this.downloadPage.addOnlineChapters(proxy, data.chapters);
        this.landingPage.updateInfos(data);
      }, (err) => {
        this.downloadPage.addOnlineChapters(proxy, []);
        this.landingPage.updateInfos();
      })
    } else {
      this.downloadPage.addOnlineChapters(proxy, []);
      this.landingPage.updateInfos();
    }
    console.log(this.manga)
  }

  async ionViewDidEnter() {
    this.slidesManager.pageCharged = true;

    this.waitViewChildInit("slides").then(async (slides) => {
      if (this.baseActiveSlide !== 0) await this.slideTo(this.baseActiveSlide);
    })
  }

  private newMangaInfoLoaded(event) {
    this.landingPage.updateInfos(event.mangaLoaded);
  }

  //Manga Information Method
  private getSelectedChapters(page: MangaInfoChapterPage) {
    return page.getSelectedChapters();
  }

  private addDownloadedChaptersToMangaStructure(chapter: DataObject) {
    if (this.manga.chapters !== undefined) {
      if (this.manga.chapters.downloadedChapters !== undefined) {
        this.manga.chapters.downloadedChapters.push(chapter);
      } else {
        this.manga.chapters["downloadedChapters"] = [chapter];
      }
    } else {
      this.manga.chapters = {
        downloadedChapters: [chapter],
        onlineChapters: {}
      }
    }
  }

  private async downloadSelectedChapters() {
    let selectedChapters = this.getSelectedChapters(this.downloadPage);
    this.slideTo(1); //1 = local chapter page
    for (let chapter of selectedChapters) {
      delete chapter['selected'];
      await this.mangaService.downloadChapter(this.manga.parsedTitle, chapter);
      //this.addDownloadedChaptersToMangaStructure(chapter)
    }
  }

  private async deleteSelectedChapters() {
    let selectedChapters = this.getSelectedChapters(this.localPage);
    console.log(selectedChapters)
    for (let chapter of selectedChapters) {
      await this.storageService.removeChapterDownload(this.manga.parsedTitle, chapter);
      this.manga.downloadedChapters = await this.storageService.getChaptersDownload(this.manga.parsedTitle);
    }
  }

  private editInfos() {
    this.landingPage.toggleEdition();
  }

  private dataToMangaInfo(event) {
    if (event.sender === "download-page") {
      if (event.event.eventName === "checkModeChanged") {

      }
    } else if (event.sender === "local-page") {

    }
  }

  //Slide Managing Method
  private async getActiveSlideIndex() {
    await this.waitViewChildInit("slides");
    return await this.slides.getActiveIndex();
  }

  private async slideTo(index: number) {
    await this.slides.slideTo(index);
  }

  private async updateFabButtonVisible() {
    await this.waitViewChildInit("slides");
    let allFabButtons = ["download-button", "delete-button", "edit-button"]
    let fabButtonsActive = [];
    switch (await this.getActiveSlideIndex()) {
      case 0:
        fabButtonsActive = ["edit-button"]
        break;
      case 1:
        fabButtonsActive = ["delete-button"]
        break;
      case 2:
        fabButtonsActive = ["download-button"]
        break;
      default:
        break;
    }
    for (let fab of allFabButtons) {
      if (fabButtonsActive.includes(fab)) {
        document.getElementById(fab).style.display = "block";
      } else {
        document.getElementById(fab).style.display = "none";
      }
    }
  }

  //Modal & Popover Method
  async close(res: DataObject = { mangaDeleted: false }) {
    this.landingPage.dismiss();
    this.localPage.dismiss();
    this.downloadPage.dismiss();
    this.manga = copyStructureOf(MangaStructure);
    await this.modalController.dismiss(res);
  }

  async openMangaInfoMenu(event) {
    await this.modalService.openPopover(MangaInfoMenuComponent, {
      manga: this.manga,
      showDeleteMangaOption: this.showDeleteMangaOption,
      storageService: this.storageService
    }, event, (res) => {
      if (res !== null && res.data !== undefined) {
        if (res.data.mangaDeleted) {
          this.close({
            mangaDeleted: true,
            mangaParsedTitle: this.manga.parsedTitle
          })
        }
      }
    })
  }

}
