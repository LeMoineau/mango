
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataObject } from './../../services/objects';

@Component({
  selector: 'manga-info-footer',
  templateUrl: './manga-info-footer.component.html',
  styleUrls: ['./manga-info-footer.component.scss'],
})
export class MangaInfoFooterComponent implements OnInit {

  @Input() fromPage: string = "localPage"; // <"localPage"|"downloadPage">

  @Output() cancelFunction = new EventEmitter();
  @Output() deleteFunction = new EventEmitter();
  @Output() downloadFunction = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  emit(outputName: string) {
    this[outputName].emit({
      eventName: outputName,
      value: "clicked"
    })
  }

}
