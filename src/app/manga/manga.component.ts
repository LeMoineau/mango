
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';

import { MangaInfoComponent } from './../manga-info/manga-info.component';

import { MangaService } from './../services/manga.service';
import { SettingsService } from './../services/settings.service';
import { ModalService } from './../services/modal.service';
import { DataObject } from './../services/objects';
import { TagsService } from './../services/tags.service';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.component.html',
  styleUrls: ['./manga.component.scss'],
})
export class MangaComponent implements OnInit {

  @Input() manga: DataObject;
  @Input() affichage: string = "normal";
  @Input() baseActiveSlide: number = 0;

  @Output() mangaInfoClose = new EventEmitter();

  private tagsEnabled: string[] = [];

  constructor(
    private mangaService: MangaService,
    private settingsService: SettingsService,
    private modalService: ModalService,
    private tagsService: TagsService,
    private navController: NavController
  ) { }

  async ngOnInit() {
    await this.updateTags();
    //console.log(this.manga)
  }

  private getSubinfoString() {
    if (this.affichage === "normal") {
      return `${this.manga.chapter.title.length > 0 ?
        `#${this.manga.chapter.num} - ${this.manga.chapter.title}` : `Chapitre ${this.manga.chapter.num}`}`;
    } else if (this.affichage === "mangatheque") {
      return ""
    } else if (this.affichage === "sourced-manga") {
      return ` ― ${this.manga.infos.source || "aucune source"} `
    } else {
      return "";
    }
  }

  private getSubsubInfoString() {
    if (this.affichage === "normal") {
      return `${this.manga.chapter.date}`; // ― ${ this.manga.chapter.source }
    } else if (this.affichage === "mangatheque") {
      return ""
    } else if (this.affichage === "sourced-manga") {
      return ""
    } else {
      return "";
    }
  }

  private async updateTags() {
    this.tagsEnabled = await this.tagsService.getAllTagOfManga(this.manga.parsedTitle);
  }

  async openMangaInfo() {
    await this.modalService.openModal(MangaInfoComponent, {
      manga: this.manga,
      showDeleteMangaOption: false,
      baseActiveSlide: this.baseActiveSlide
    }, async (res) => {
      this.mangaInfoClose.emit(res)
      await this.updateTags()
    })
  }

}
