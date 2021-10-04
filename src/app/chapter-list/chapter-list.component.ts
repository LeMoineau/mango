
import { Component, OnInit, Input } from '@angular/core';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
})
export class ChapterListComponent implements OnInit {

  @Input() chapterList: DataObject;
  @Input() manga: DataObject;

  @Input() title: string = "Liste de Chapitres";
  @Input() showDeleteOption: boolean = true;
  @Input() showDownloadOption: boolean = true;
  @Input() InWaiting: boolean = false;

  private maxChapterPermitted: number = 10;
  private offset: number = 10;
  private NotFoundMessage: DataObject = null;

  constructor() {
    this.NotFoundMessage = getRandomNotFoundMessage();
  }

  ngOnInit() {}

  private test(event) {
    console.log(event)
  }

  //Basics Methods
  private showMore(event) {
    if (this.chapterList.length >= this.maxChapterPermitted) {
      this.maxChapterPermitted += this.offset;
    }
    event.target.complete();
  }

  private chapterExist(index: number) {
    return (this.chapterList !== undefined && this.chapterList.length > index);
  }

  private noChapters() {
    return !(this.chapterList !== undefined && this.chapterList.length > 0)
  }

  private nbChapters() {
    return this.chapterList === undefined ? 0 : this.chapterList.length;
  }

}
