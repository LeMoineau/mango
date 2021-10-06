
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MangaReaderComponent } from './../../manga-reader/manga-reader.component';

import { DataObject } from './../../services/objects';
import { MangaService } from './../../services/manga.service';
import { ModalService } from './../../services/modal.service';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss'],
})
export class ChapterComponent implements OnInit {

  @Input() chapter: DataObject;
  @Input() mangaParent: DataObject;
  @Input() showDeleteOption: boolean = true;
  @Input() showDownloadOption: boolean = true;
  @Input() isInCheckMode: boolean = false;

  @Output() checkingChange = new EventEmitter<DataObject>();
  @Input() isChecked: boolean = false;

  constructor(
    private modalService: ModalService,
    private mangaService: MangaService
  ) {}

  ngOnInit() {}

  //Basics Methods
  private toggleChecked() {
    this.checkingChange.emit({
      eventName: "checkingChapterChange",
      isChecked: this.isChecked
    })
  }

  //Specifics Methods
  private readManga(chapter: DataObject) {
    this.modalService.openModal(MangaReaderComponent, {
      chapter: chapter
    }, (res) => {

    })
  }

  public deleteChapter(chapter: DataObject) {
    let index = this.mangaParent.chapters.downloadedChapters.indexOf(chapter);
    this.mangaParent.chapters.downloadedChapters.splice(index, 1);
    this.mangaService.deleteDownloadChapter(this.mangaParent.parsedTitle, chapter);
  }

  private async openActionSheet(chapter: DataObject) {
    let buttons = [
      {
        text: "Lire le Chapitre",
        role: "read",
        icon: "book",
        handler: () => {
          this.readManga(chapter);
        }
      },
      {
        text: "Télécharger le Chapitre",
        role: "download",
        icon: "download",
        handler: () => {
          this.deleteChapter(chapter);
        }
      },
      {
        text: "Supprimer le Chapitre",
        role: "delete",
        icon: "trash",
        handler: () => {
          this.deleteChapter(chapter);
        }
      }
    ]
    if (!this.showDeleteOption) buttons.splice(2, 1)
    if (!this.showDownloadOption) buttons.splice(1, 1)

    await this.modalService.presentActionSheet(
      `${chapter.title !== undefined ? `Chapitre ${chapter.num} - ${chapter.title}` : `Chapitre ${chapter.num}`}`,
      (res) => {
        console.log(res)
      },
      buttons
    )
  }

}
