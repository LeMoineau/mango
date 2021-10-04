
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { IonText } from '@ionic/angular';

import { SettingsService } from './../services/settings.service';
import { getRandomNumber } from './../services/utils';
import { RandomColors } from './../services/objects';

@Component({
  selector: 'manga-icon',
  templateUrl: './manga-icon.component.html',
  styleUrls: ['./manga-icon.component.scss'],
})
export class MangaIconComponent implements OnInit {

  @Input() mangaTitle: string = "Manga Sans Nom";
  @Input() mangaImage: string = "./../assets/icon/favicon.png";

  private displayedTitle: string = "MSN";
  private backgroundColor: string = "white";

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    let words = this.mangaTitle.split(" ");
    let displayedTitle = "";
    for (let word of words) {
      if (displayedTitle.length < 5) {
        displayedTitle += word[0];
        if (words.length <= 2 && word.length >= 2) displayedTitle += word[1];
        if (words.length <= 1 && word.length >= 3) displayedTitle += word[2];
      }
    }
    this.displayedTitle = displayedTitle;

    const colorIndex = getRandomNumber(RandomColors.length);
    this.backgroundColor = RandomColors[colorIndex];
  }

  private lowConnectionModeActivated() {
    return this.settingsService.getParameter('lowConnectionMode');
  }

}
