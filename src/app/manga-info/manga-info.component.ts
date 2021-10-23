
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

  private landing = MangaInfoLandingPageComponent;
  private local = MangaInfoLocalPageComponent;
  private download = MangaInfoDownloadPageComponent;
  private thisInstance = this;

  @ViewChild('supertabs', {static: false}) superTabsComp;

  private baseActiveSlide: number = 0;
  private showDeleteMangaOption: boolean = false;
  private isInCheckMode: boolean = false;
  private pageCheckedName: string;

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
      this.getTab("landingPage").updateInfos(knowMangaInformation, !this.settingsService.getParameter("lowConnectionMode"));
    }

    //Check online manga informations for the proxy 'proxyDownloadChapter'
    let proxy = this.settingsService.getParameter('proxyDownloadChapter');
    if (!this.settingsService.getParameter("lowConnectionMode")) {
      this.mangaService.getMangaInfos(proxy, this.manga.parsedTitle, (data) => {
        this.getTab("downloadPage").addOnlineChapters(proxy, data.chapters);
        this.getTab("landingPage").updateInfos(data);
      }, (err) => {
        this.getTab("downloadPage").addOnlineChapters(proxy, []);
        this.getTab("landingPage").updateInfos();
      })
    } else {
      this.getTab("downloadPage").addOnlineChapters(proxy, []);
      this.getTab("landingPage").updateInfos();
    }
  }

  private newMangaInfoLoaded(event) {
    this.getTab("landingPage").updateInfos(event.mangaLoaded);
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

  public async downloadChapter(chapter: DataObject) {
    this.swipeTo(1)
    delete chapter['selected'];
    await this.mangaService.downloadChapter(this.manga.parsedTitle, chapter, (progress) => {
      //console.log(progress)
      if (progress.action === "length") {
        this.getTab("localPage").addInDownloadingChapter(progress.chapter, progress.length);
      } else if (progress.action === "request" || progress.action === "download") {
        this.getTab("localPage").progressInDownloadingChapter(progress);
      } else if (progress.action === "end") {
        this.getTab("localPage").removeInDownloadingChapter(progress.chapter);
      } else {
        this.getTab("localPage").progressInDownloadingChapter(progress);
        console.log(progress);
      }
    });
  }

  private async downloadSelectedChapters() {
    let selectedChapters = this.getSelectedChapters(this.getTab("downloadPage"));
    this.closeFooter();
    this.swipeTo(1);
    for (let chapter of selectedChapters) {
      this.downloadChapter(chapter);
    }
  }

  private async deleteSelectedChapters() {
    let selectedChapters = this.getSelectedChapters(this.getTab("localPage"));
    console.log("selected chapters:")
    console.log(selectedChapters)
    for (let chapter of selectedChapters) {
      await this.storageService.removeChapterDownload(this.manga.parsedTitle, chapter);
      this.getTab("localPage").updateDownloadedChapters();
    }
  }

  private editInfos() {
    this.getTab("landingPage").toggleEdition();
  }

  private closeFooter(event?) {
    let tab = this.getTab(this.pageCheckedName)
    if (tab.isReadyToDisableCheckMode()) {
      this.isInCheckMode = false;
      tab.setCheckModeInChapterListChildren(false);
    }
  }

  public dataToMangaInfo(infos) {
    console.log(infos)
    if (infos.event !== undefined && infos.event.eventName === "checkModeChanged") {
      this.isInCheckMode = infos.event.value;
      this.pageCheckedName = infos.sender;
    }
  }

  //SuperTabs Methods
  private async swipeTo(index: number) {
    await this.superTabsComp.selectTab(index);
  }

  //Modal & Popover Method
  async close(res: DataObject = { mangaDeleted: false }) {
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
