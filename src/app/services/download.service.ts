
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import axios from 'axios';

import { DataObject } from './objects';
import { StorageService } from './storage.service';
import { getExtensionOfImageUrl } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private _fileTransfer: FileTransferObject | null = null;
  private downloadFile = Directory.Data;

  constructor(
    private transfer: FileTransfer,
    private file: File,
    private storageService: StorageService
  ) {
    this.init();
  }

  init() {
    this._fileTransfer = this.transfer.create();
  }

  //Basics Methods
  async fileExist(path: string) {
    const res = await this.readFile(path).then(() => {
      return true
    }).catch(err => {
      return false
    })
    console.log(res)
    return res
  }

  async deleteFile(path: string) {
    if (await this.fileExist(path)) {
      await Filesystem.deleteFile({
        path: path,
        directory: this.downloadFile
      });
    }
  }

  async writeFile(path: string, base64Data) {
    await Filesystem.writeFile({
      path: path,
      data: base64Data,
      directory: this.downloadFile
    });
  }

  async readFile(path: string) {
    let contents = await Filesystem.readFile({
      path: path,
      directory: this.downloadFile
    });
    return contents.data || contents;
  }

  //More specifics Methods
  private convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  public async downloadChapterPage(mangaParsedTitle, fileName, response, url, callback) {

    const base64Data = await this.convertBlobToBase64(response) as string;
    const path = `/chapters/${mangaParsedTitle}/${fileName}.png`;

    this.writeFile(path, base64Data).then((res) => {
      callback({
        path: path,
        fileName: fileName,
        mangaParsedTitle: mangaParsedTitle,
        ext: getExtensionOfImageUrl(url)
      })
    })
  }

  public async removeChapter(mangaParsedTitle, chapter) {
    for (let i = 0; i<chapter.pages.length; i++) {
      let page = chapter.pages[i];
      await this.deleteFile(page.path);
    }
  }

}
