
import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import axios from 'axios';

import { DataObject } from './objects';
import { StorageService } from './storage.service';
import { getExtensionOfImageUrl } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private downloadFile = Directory.Data;

  constructor(
    private file: File,
    private storageService: StorageService
  ) {}

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

  async writeFile(path: string, base64Data, recursive: boolean = true) {
    await Filesystem.writeFile({
      path: path,
      data: base64Data,
      directory: this.downloadFile,
      recursive: recursive
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
  private convertBlobToBase64(blob: Blob, callback?: Function) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      // Is this a "real" file? In other words, is this an instance of the original `File` class (not the one overriden by cordova-plugin-file).
      // If so, then we need to use the "real" FileReader (not the one overriden by cordova-plugin-file).
      if (blob instanceof Blob) {
        const realFileReader = (reader as any)._realReader;
        if (realFileReader) {
          reader = realFileReader;
        }
      }
      reader.onerror = reject
      reader.onload = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });
  }

  public async downloadChapterPage(mangaParsedTitle, fileName, response, url, callback) {
    await this.convertBlobToBase64(response).then(async (base64Data) => {
      const path = `/chapters/${mangaParsedTitle}/${fileName}.png`;

      if ((base64Data as string).includes("base64,")) {
        base64Data = (base64Data as string).split("base64,")[1];
      }

      await this.writeFile(path, base64Data)

      callback({
        path: path,
        fileName: fileName,
        mangaParsedTitle: mangaParsedTitle,
        ext: getExtensionOfImageUrl(url)
      })
    });
  }

  public async removeChapter(mangaParsedTitle, chapter) {
    for (let i = 0; i<chapter.pages.length; i++) {
      let page = chapter.pages[i];
      await this.deleteFile(page.path);
    }
  }

}
