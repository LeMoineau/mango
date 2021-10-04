
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ProxyService } from './../../../services/proxy.service';
import { DataObject } from './../../../services/objects';
import { SettingsService } from './../../../services/settings.service';

@Component({
  selector: 'manga-info-proxy-selector-bar',
  templateUrl: './manga-info-proxy-selector-bar.component.html',
  styleUrls: ['./manga-info-proxy-selector-bar.component.scss'],
})
export class MangaInfoProxySelectorBarComponent implements OnInit {

  private selectedProxy: string;

  @Output() proxySelectedChange = new EventEmitter<DataObject>();

  constructor(
    private settingsService: SettingsService,
    private proxyService: ProxyService
  ) { }

  ngOnInit() {
    this.selectedProxy = this.settingsService.getParameter('proxyDownloadChapter');
  }

  private changeProxy(proxy: string) {
    this.selectedProxy = proxy;
    this.proxySelectedChange.emit({ selectedProxy: proxy });
  }

  private changeProxyValue(event) {
    this.changeProxy(event.detail.value);
  }

}
