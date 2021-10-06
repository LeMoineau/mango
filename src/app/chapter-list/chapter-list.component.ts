
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataObject, getRandomNotFoundMessage } from './../services/objects';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
})
export class ChapterListComponent implements OnInit {

  @Input() chapterList: DataObject[];
  @Input() manga: DataObject;

  @Input() title: string = "Liste de Chapitres";
  @Input() showDeleteOption: boolean = true;
  @Input() showDownloadOption: boolean = true;
  @Input() InWaiting: boolean = false;

  private maxChapterPermitted: number = 10;
  private offset: number = 10;

  private NotFoundMessage: DataObject = null;

  private checkedChapter: DataObject[] = [];
  private checkMode: boolean = false;
  @Output() checkModeChanged = new EventEmitter<DataObject>();
  @Output() updateCheckedChapterList = new EventEmitter<DataObject>();

  constructor() {
    this.NotFoundMessage = getRandomNotFoundMessage();
  }

  ngOnInit() {}

  //Basics Methods
  private chapterExist(index: number) {
    return (this.chapterList !== undefined && this.chapterList.length > index);
  }

  private noChapters() {
    return !(this.chapterList !== undefined && this.chapterList.length > 0)
  }

  private nbChapters() {
    return this.chapterList === undefined ? 0 : this.chapterList.length;
  }

  private toggleCheckMode() {
    this.checkMode = !this.checkMode;
    this.checkModeChanged.emit({
      eventName: "checkModeChanged",
      checkMode: this.checkMode
    })
  }

  public isInCheckMode() {
    return this.checkMode;
  }

  //Specifics Methods
  private showMore(event) {
    if (this.chapterList.length >= this.maxChapterPermitted) {
      this.maxChapterPermitted += this.offset;
    }
    event.target.complete();
  }

  public changeCheckedChapter(isChecked: boolean, chapter: DataObject) {
    if (!isChecked && this.checkedChapter.includes(chapter)) {
      let index = this.checkedChapter.findIndex(c => c === chapter);
      if (index !== -1) {
        this.checkedChapter.splice(index, 1);
      }
    } else if (isChecked && !this.checkedChapter.includes(chapter)) {
      this.checkedChapter.push(chapter)
    }
    this.updateCheckedChapterList.emit({
      eventName: "updateCheckedChapterList",
      checkedChapter: this.checkedChapter
    })
  }

  private changeCheckedAll(event) {
    for (let chapter of this.chapterList) {
      this.changeCheckedChapter(event.detail.checked, chapter);
    }
    console.log(this.checkedChapter)
  }

}
