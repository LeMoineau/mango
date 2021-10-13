
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
  @Input() progress: DataObject;

  @Output() checkingChange = new EventEmitter<DataObject>();
  @Input() isChecked: boolean = false;

  //Options
  @Input() affichage: string = "normal"; //<normal|downloading>
  @Input() modalOptionsToShow: string[] = ["read", "delete", "download"];
  @Input() isInCheckMode: boolean = false;
  @Input() isCheckable: boolean = true;

  constructor(
    private modalService: ModalService,
    private mangaService: MangaService
  ) { }

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
    let bankButtons = [
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
    let buttons = []
    for (let role of this.modalOptionsToShow) {
      let b = bankButtons.find(b => b.role === role);
      if (b !== undefined) {
        buttons.push(b);
      }
    }

    await this.modalService.presentActionSheet(
      `${chapter.title !== undefined ? `Chapitre ${chapter.num} - ${chapter.title}` : `Chapitre ${chapter.num}`}`,
      (res) => {
        console.log(res)
      },
      buttons
    )
  }

}
