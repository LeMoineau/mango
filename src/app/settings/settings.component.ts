
import { Component, OnInit } from '@angular/core';
import { ToastController, NavController, NavParams } from '@ionic/angular';

import { SettingsService } from './../services/settings.service';
import { StorageService } from './../services/storage.service';
import { MangaService } from './../services/manga.service';
import { ProxyService } from './../services/proxy.service';
import { ModalService } from './../services/modal.service';
import { InitialSettings } from './../services/objects';

import { MangaInfoComponent } from './../manga-info/manga-info.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  private appContainer: MangaInfoComponent;

  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
    private mangaService: MangaService,
    private toastController: ToastController,
    private modalService: ModalService,
    public navCtrl: NavController,
    private navParams: NavParams,
    private proxyService: ProxyService
  ) {
    this.appContainer = navParams.get("appContainer");
    this.appContainer.synchroniseTab({
      keyName: "settingsPage",
      comp: this
    })
  }

  ngOnInit() {}

  private async showStorage() {
    console.log(await this.storageService.getAll());
  }

  private showAllSettings() {
    console.log(this.settingsService.getSettings())
    console.log(InitialSettings)
  }

  private async eraseAllStorage() {
    this.modalService.alertConfirmation(
      "Effacer tous les mangas sauvegardés",
      "Etes-vous sûr de vouloir supprimer tous les mangas et chapitres sauvegardés ?",
      async () => {
        await this.mangaService.deleteAllChapters();
        await this.storageService.clearAll();
        await this.showNotification("Nous avons laché tous les oiseaux... Il n'y a plus rien")
      }
    )
  }

  private getUpdatedIconDarkMode(baseIcon) {
    if (this.settingsService.getParameter("darkMode")) {
      return baseIcon
    } else {
      return `${baseIcon}-outline`
    }
  }

  private async viderCache() {
    this.mangaService.resetMangaInfosAlreadyLoaded();
    await this.showNotification("Le cache est tout vide maintenant !")
  }

  private async showNotification(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: duration
    });
    toast.present();
  }

  private async selectChange(parameter: string, event) {
    this.settingsService.setParameter(parameter, event.detail.value);
    if (parameter === "proxyNewChapter") {
      await this.appContainer.getTab("downloadPage").resetNewMangaChapters();
    }
    await this.showNotification(`Source mise à jour pour '${event.detail.value}' !`);
  }

}
