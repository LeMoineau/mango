
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { DataObject } from './../../services/objects';
import { TagsService } from './../../services/tags.service';

@Component({
  selector: 'app-manga-info-menu',
  templateUrl: './manga-info-menu.component.html',
  styleUrls: ['./manga-info-menu.component.scss'],
})
export class MangaInfoMenuComponent implements OnInit {

  private manga: DataObject = {};
  showDeleteMangaOption: boolean = false;

  constructor(
    private popoverController: PopoverController,
    private tagsService: TagsService
  ) {}

  async ngOnInit() {
    await this.init();
  }

  async init() {
    console.log(this.tagsService.iter());
    this.tagsService.updateTagsStates(this.manga.parsedTitle);
    if (!this.showDeleteMangaOption) {
      document.getElementById("delete-button").style.display = "none";
    }
  }

  async close(res: DataObject = { mangaDeleted: false }) {
    await this.popoverController.dismiss(res)
  }

  async deleteManga() {
    await this.close({ mangaDeleted: true })
  }

  private async toggleTag(tag: string) {
    this.tagsService.toggleTag(tag, this.manga, this.manga.parsedTitle);
  }

}
