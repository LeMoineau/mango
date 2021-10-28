
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

  private _manga: DataObject;
  private _affichage: string = "normal";
  @Input() baseActiveSlide: number = 0;

  @Output() mangaInfoClose = new EventEmitter();

  private tagsEnabled: string[] = [];
  private lines: DataObject = {
    title: "Titre du manga",
    subInfo: "",
    subsubInfo: ""
  }

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
    console.log(this.lines)
  }

  //Getter & Setters
  @Input() set manga(val: DataObject) {
    this._manga = val;
    this.updateLines();
  }

  get manga() {
    return this._manga;
  }

  @Input() set affichage(val: string) {
    this._affichage = val;
    this.updateLines();
  }

  get affichage() {
    return this._affichage;
  }

  //Specifics Methods
  private updateLines() {
    if (this.manga !== undefined) this.lines.title = this.manga.title;

    if (this.affichage === "normal") {

      this.lines.subInfo = `${this.manga.chapter.title.length > 0 ?
        `#${this.manga.chapter.num} - ${this.manga.chapter.title}` : `Chapitre ${this.manga.chapter.num}`}`;
      this.lines.subsubInfo = `${this.manga.chapter.date}`; // ― ${ this.manga.chapter.source }

    } else if (this.affichage === "mangatheque") {

    } else if (this.affichage === "sourced-manga") {

      this.lines.subInfo = ` ― ${this.manga.infos.source || "aucune source"}`

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
