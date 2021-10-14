
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SynchroniserSuperTabs } from './../modules/synchroniser-super-tabs.module';

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
import { FabButtonService } from './../services/fab-button.service';

@Component({
  selector: 'app-manga-info',
  templateUrl: './manga-info.component.html',
  styleUrls: ['./manga-info.component.scss'],
})
export class MangaInfoComponent extends SynchroniserSuperTabs {

  private landingPage: MangaInfoLandingPageComponent = null;
  private localPage: MangaInfoLocalPageComponent = null;
  private downloadPage: MangaInfoDownloadPageComponent = null;

  private landing = MangaInfoLandingPageComponent;
  private local = MangaInfoLocalPageComponent;
  private download = MangaInfoDownloadPageComponent;
  private thisInstance = this;

  private baseActiveSlide: number = 0;
  private slidesManager: DataObject = {
    screenSize: "100vh",
    slidesIds: ["information-slide", "localSection-slide", "onlineSection-slide"],
    pageCharged: false
  }

  private showDeleteMangaOption: boolean = false;

  @Input() manga: DataObject = {}

  constructor(
    private modalController: ModalController,
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private storageService: StorageService,
    private modalService: ModalService,
    private fabButtonService: FabButtonService
  ) {
    super();
  }

  public afterAllTabCharged() {
    this.init();
  }

  private async init() {
    this.manga = concatener(this.manga, {...MangaStructure});

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
      await this.mangaService.downloadChapter(this.manga.parsedTitle, chapter, (progress) => {
        console.log(progress)
        if (progress.action === "length") {
          this.localPage.addInDownloadingChapter(progress.chapter, progress.length);
        } else if (progress.action === "request" || progress.action === "download") {
          this.localPage.progressInDownloadingChapter(progress);
        } else if (progress.action === "end") {
          this.localPage.removeInDownloadingChapter(progress.chapter);
        } else {
          console.log(progress);
        }
      });
      //this.addDownloadedChaptersToMangaStructure(chapter)
    }
  }

  private async deleteSelectedChapters() {
    let selectedChapters = this.getSelectedChapters(this.localPage);
    console.log("selected chapters:")
    console.log(selectedChapters)
    for (let chapter of selectedChapters) {
      await this.storageService.removeChapterDownload(this.manga.parsedTitle, chapter);
      this.localPage.updateDownloadedChapters();
    }
  }

  private editInfos() {
    this.landingPage.toggleEdition();
  }

  private dataToMangaInfo(event) {
    console.log(event)
    if (event.event !== undefined) {
      if (event.event.eventName === "checkModeChanged") {
        this.fabButtonService.toggleCurrentFabVisibility(event.event.checkMode)
      }
    } else {
      if (event.eventName === "toggleEdition") {
        this.fabButtonService.toggleCurrentFabVisibility(event.inEdition)
      }
    }
  }

  //Slide Managing Method
  private async getActiveSlideIndex() {
    //return await this.slides.getActiveIndex();
  }

  private async slideTo(index: number) {
    //await this.slides.slideTo(index);
  }

  private async slideChange() {
    //this.fabButtonService.updateCurrentPage(await this.getActiveSlideIndex());
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
