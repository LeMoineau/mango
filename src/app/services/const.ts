
import { GlobalFooterComponent } from './../global/global-footer/global-footer.component';
import { GlobalHeaderComponent } from './../global/global-header/global-header.component';
import { MangathequeComponent } from './../mangatheque/mangatheque.component';
import { DownloadComponent } from './../download/download.component';
import { SettingsComponent } from './../settings/settings.component';
import { MangaComponent } from './../manga/manga.component';
import { SettingsToggleItemComponent } from './../settings/settings-toggle-item/settings-toggle-item.component';
import { MangaInfoComponent } from './../manga-info/manga-info.component';
import { MangaInfoMenuComponent } from './../manga-info/manga-info-menu/manga-info-menu.component';
import { MangaReaderComponent } from './../manga-reader/manga-reader.component';
import { MangaIconComponent } from './../manga-icon/manga-icon.component';
import { MangaInfoLandingPageComponent } from './../manga-info/manga-info-landing-page/manga-info-landing-page.component';
import { MangaInfoDownloadPageComponent } from './../manga-info/manga-info-download-page/manga-info-download-page.component';
import { MangaInfoProxySelectorBarComponent }
  from './../manga-info/manga-info-download-page/manga-info-proxy-selector-bar/manga-info-proxy-selector-bar.component';
import { MangaInfoLocalPageComponent } from './../manga-info/manga-info-local-page/manga-info-local-page.component';
import { ChapterListComponent } from './../chapter-list/chapter-list.component';
import { ChapterComponent } from './../chapter-list/chapter-component/chapter.component';
import { MangaInfoFooterComponent } from './../manga-info/manga-info-footer/manga-info-footer.component';

import { LongTapDirective } from './../directives/long-tap/long-tap.directive'

import { MangaService } from './manga.service';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';
import { DownloadService } from './download.service';
import { ModalService } from './modal.service';
import { TagsService } from './tags.service';
import { ProxyService } from './proxy.service';
import { FabButtonService } from './fab-button.service';

export const DeclaredComponents = [
  DownloadComponent,
  GlobalFooterComponent,
  GlobalHeaderComponent,
  SettingsToggleItemComponent,
  MangaInfoComponent,
  MangaInfoMenuComponent,
  MangaComponent,
  SettingsComponent,
  MangathequeComponent,
  MangaReaderComponent,
  MangaIconComponent,
  MangaInfoLandingPageComponent,
  MangaInfoDownloadPageComponent,
  MangaInfoProxySelectorBarComponent,
  MangaInfoLocalPageComponent,
  LongTapDirective,
  ChapterListComponent,
  ChapterComponent,
  MangaInfoFooterComponent
]

export const ProvidedServices = [
  StorageService,
  MangaService,
  SettingsService,
  DownloadService,
  ModalService,
  TagsService,
  ProxyService,
  FabButtonService
]
