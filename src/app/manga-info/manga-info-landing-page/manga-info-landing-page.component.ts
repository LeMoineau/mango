
import { Component, OnInit } from '@angular/core';

import { MangaInfoPage } from './../manga-info.page';

import { DataObject, MangaStructure } from './../../services/objects';
import { StorageService } from './../../services/storage.service';
import { TagsService } from './../../services/tags.service';
import { copyObject } from './../../services/utils';
import { ModalService } from './../../services/modal.service';
import { SettingsService } from './../../services/settings.service';

@Component({
  selector: 'manga-info-landing-page',
  templateUrl: './manga-info-landing-page.component.html',
  styleUrls: ['./manga-info-landing-page.component.scss'],
})
export class MangaInfoLandingPageComponent extends MangaInfoPage implements OnInit {

  private inEdition: boolean = false;
  private newInfoKeys: DataObject = {}

  constructor(
    private storageService: StorageService,
    private tagsService: TagsService,
    private modalService: ModalService,
    private settingsService: SettingsService
  ) {
    super();
  }

  async ngOnInit() {
    this.beginWaiting();
    this.tagsService.updateTagsStates(this.manga.parsedTitle);
  }

  //Basics Methods
  private addInfos(key: string, value: any) {
    if (value.length > 0) {
      let index = this.manga.infos.iter.findIndex((infoKey) => {
        return (infoKey.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(infoKey.toLowerCase()))
      })
      if (index === -1) {
        this.manga.infos.iter.push(key);
        this.manga.infos[key] = value;
      }
    }
  }

  public updateInfos(manga: DataObject = null, waitOtherInfos: boolean = false) {
    if (manga !== null && manga.infos !== undefined) {
      if (manga.infos.iter === undefined) {
        manga.infos.iter = Object.keys(manga.infos)
      }
      for (let key of manga.infos.iter) {
        this.addInfos(key, manga.infos[key]);
      }
    }
    if (!waitOtherInfos) {
      if (manga !== null) {
        this.storageService.updateMangaInfos(this.manga.parsedTitle, manga.infos)
      }
      this.endWaiting();
    }
  }

  public dismiss(): void {
    this.editionEnd(false);
  }

  //More specifics Methods
  public editionStart() {
    this.inEdition = true;
  }

  public async editionEnd(saveEdition: boolean = true) {
    for (let infoKey in this.newInfoKeys) {
      this.editInfosKey(infoKey, this.newInfoKeys[infoKey])
    }
    if (saveEdition) await this.storageService.updateMangaInfos(this.manga.parsedTitle, this.manga.infos);
    this.tagsService.updateTagsStates(this.manga.parsedTitle, true);
    this.inEdition = false;
  }

  public isInEdition() {
    return this.inEdition;
  }

  public toggleEdition() {
    if (this.isInEdition()) {
      this.editionEnd();
      console.log(this.manga)
    } else {
      this.editionStart();
    }
  }

  private addNewInformationInEdition() {
    let compteur = 1;
    while (this.manga.infos !== undefined && this.manga.infos.iter !== undefined && this.manga.infos.iter.includes(`Info #${compteur}`)) {
      compteur += 1;
    }
    this.addInfos(`Info #${compteur}`, "Nouvelle information")
  }

  private async deleteInformation(infoKey) {
    if (this.isInEdition()) {
      await this.modalService.alertConfirmation(
        "Supprimer une information",
        `Etes-vous sur de vouloir supprimer l'information "${infoKey}" ?`,
        () => {
          let index = this.manga.infos.iter.findIndex(i => i === infoKey);
          if (index !== -1) {
            this.manga.infos.iter.splice(index, 1);
            delete this.manga.infos[infoKey];
          }
        }
      )
    }
  }

  private addNewInfoKey(infoKey, newInfoKey) {
    this.newInfoKeys[infoKey] = newInfoKey;
  }

  private editInfosKey(infoKey, newInfoKey) {
    if (this.isInEdition()) {
      let index = this.manga.infos.iter.findIndex(i => i === infoKey)
      if (index !== -1) {
        this.manga.infos[newInfoKey] = this.manga.infos[infoKey];
        delete this.manga.infos[infoKey];
        this.manga.infos.iter.splice(index, 1, newInfoKey);
      }
    }
  }

}
