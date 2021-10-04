
import { Component, OnInit, Input } from '@angular/core';

import { DataObject } from './../services/objects';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss'],
})
export class ChapterListComponent implements OnInit {

  @Input() chapterList: DataObject;
  @Input() manga: DataObject;

  private maxChapterPermitted: number = 10;
  private offset: number = 10;

  constructor() {
    console.log(this.chapterList)
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

}
