
import { Component, OnInit, Input } from '@angular/core';

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

  constructor(
    private modalService: ModalService,
    private mangaService: MangaService
  ) {}

  ngOnInit() {}

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
    await this.modalService.presentActionSheet(
      `${chapter.title !== undefined ? `Chapitre ${chapter.num} - ${chapter.title}` : `Chapitre ${chapter.num}`}`,
      (res) => {
        console.log(res)
      },
      {
        text: "Lire le Chapitre",
        role: "read",
        icon: "book",
        handler: () => {
          this.readManga(chapter);
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
    )
  }

}
