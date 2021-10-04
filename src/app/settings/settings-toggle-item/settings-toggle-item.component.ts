
import { Component, Input, OnInit } from '@angular/core';
import { SettingsService } from './../../services/settings.service';

@Component({
  selector: 'settings-toggle-item',
  templateUrl: './settings-toggle-item.component.html',
  styleUrls: ['./settings-toggle-item.component.scss'],
})
export class SettingsToggleItemComponent implements OnInit {

  @Input() baseIcon: string = "cog";
  @Input() targetParameter: string = "darkMode";
  @Input() baseChecked: boolean = false;

  constructor(private settingsService: SettingsService) { }

  async ngOnInit() {
    await this.settingsService.ready();
    this.baseChecked = this.settingsService.getParameter(this.targetParameter);
  }

  getIcon() {
    let darkMode = this.settingsService.getParameter("darkMode");
    if (darkMode) {
      return this.baseIcon;
    } else {
      return `${this.baseIcon}-outline`;
    }
  }

  toggleTargetParameter() {
    this.settingsService.toggleParameter(this.targetParameter);
    console.log(`${this.targetParameter} set to ${this.settingsService.getParameter(this.targetParameter)}`)
  }

}
