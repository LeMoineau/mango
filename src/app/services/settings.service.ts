
import { Injectable } from '@angular/core';

import { StorageService } from './storage.service';
import { InitialSettings } from './objects';

@Injectable()
export class SettingsService {

  private _settings = {...InitialSettings}
  private _settingsReady = false;

  constructor(
    private storageService: StorageService
  ) {
    this.init();
  }

  async init() {
    let storageSettings = await this.storageService.get("settings");
    if (storageSettings.darkMode === undefined) {
      await this.storageService.set("settings", {});
    } else {
      for (let field in storageSettings) {
        this.setParameter(field, storageSettings[field]);
      }
    }
  }

  getSettings() {
    return this._settings;
  }

  async ready(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this._settingsReady) {
        await this.init();
      }
      resolve(this._settingsReady)
    })
  }

  setParameter(index, value) {
    if (this.hasParameter(index)) {
      this._settings[index] = value;
      this.storageService.setInObject("settings", index, this.getParameter(index));

      if (index === "darkMode") this.updateDarkMode();
    }
  }

  getParameter(index) {
    return this._settings[index];
  }

  hasParameter(index) {
    return (this.getParameter(index) !== undefined);
  }

  toggleParameter(index) {
    if (this.hasParameter(index) && typeof(this.getParameter(index)) === "boolean") {
      this.setParameter(index, !this.getParameter(index))
    }
  }

  updateDarkMode() {
    let darkMode = this.getParameter("darkMode");
    document.body.classList.toggle("dark", darkMode);
  }

  getImageToShow(urlImage: string) {
    if (this.getParameter("lowConnectionMode")) {
      return "assets/icon/favicon.png";
    } else {
      return urlImage;
    }
  }

}
