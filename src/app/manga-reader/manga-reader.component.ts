
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, IonSelect } from '@ionic/angular';

import { DataObject } from './../services/objects';
import { DownloadService } from './../services/download.service';

@Component({
  selector: 'app-manga-reader',
  templateUrl: './manga-reader.component.html',
  styleUrls: ['./manga-reader.component.scss'],
})
export class MangaReaderComponent implements OnInit {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild('select') pageSelector: IonSelect;

  private loadingConst: DataObject = {
    pageCharged: false
  }

  private slidesOpts: DataObject = {
    zoom: true
  }

  private readerInfos: DataObject = {
    pagesContent: [],
    currentPage: 1,
    nbPages: 1,
    pagesNumbers: []
  }

  private chapter: DataObject = {
    pages: []
  }

  constructor(
    private modalController: ModalController,
    private downloadService: DownloadService
  ) { }

  ngOnInit() {}

  async ionViewDidEnter() {
    this.loadingConst.pageCharged = true;
    console.log(this.chapter)

    await this.init();
  }

  private async init() {
    for (let i = 1; i<=this.chapter.pages.length; i++) {
      this.readerInfos.pagesNumbers.push(i)
    }
    this.pageSelector.value = this.readerInfos.currentPage;

    for (let page of this.getPages(this.chapter)) {
      let content = await this.downloadService.readFile(page.path);
      this.readerInfos.pagesContent.push(`data:image/${page.ext};base64,${content}`);
    }
    this.readerInfos.nbPages = this.chapter.nbPages;
  }

  //Basics Methods
  private getImage(index: number) {
    return this.readerInfos.pagesContent[index] || "./../assets/icon/favicon.png"
  }

  private getPages(chapter: DataObject) {
    let pages = [];
    for (let i = 0; i<chapter.pages.length; i++) {
      pages.push(chapter.pages[i]);
    }
    return pages;
  }

  private async close() {
    this.modalController.dismiss({
      closed: true
    })
  }

  //Slides Events Methods
  private async getActiveSlideIndex() {
    return await this.slides.getActiveIndex();
  }

  private async goToPage(index: number) {
    await this.slides.slideTo(index - 1);
    this.readerInfos.currentPage = index;
    this.pageSelector.value = this.readerInfos.currentPage;
  }

  private async slideChange() {
    let selectedSlideIndex = await this.getActiveSlideIndex();
    await this.goToPage(selectedSlideIndex - 0 + 1);
  }

  private async changePage(event) {
    const value = event.detail.value;
    if (`${value}` !== `${this.readerInfos.currentPage}`) {
      await this.goToPage(value);
    }
  }

  private async zoom(way: string) {
    const slider = await this.slides.getSwiper();
    const zoom = slider.zoom;
    zoom[way]();
  }

  private async movePage(way: string) {
    switch (way) {
      case 'left':
        await this.goToPage(this.readerInfos.currentPage - 1);
        break;
      case 'right':
        await this.goToPage(this.readerInfos.currentPage - 0 + 1);
        break;
    }
  }

}
