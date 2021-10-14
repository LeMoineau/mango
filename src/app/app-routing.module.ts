import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { MangathequeComponent } from './mangatheque/mangatheque.component';
import { DownloadComponent } from './download/download.component';
import { SettingsComponent } from './settings/settings.component';
import { MangaInfoComponent } from './manga-info/manga-info.component';

const routes: Routes = [
  { path: '', component: MangathequeComponent },
  { path: 'mangatheque', component: MangathequeComponent },
  { path: 'download', component: DownloadComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'manga-info', component: MangaInfoComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
