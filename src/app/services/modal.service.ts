
import { Injectable } from '@angular/core';
import { ModalController, PopoverController, AlertController, ActionSheetController } from '@ionic/angular';

import { DataObject } from './objects';

@Injectable()
export class ModalService {

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  async openModal(modal: any, props: DataObject, callbackDismiss) {
    const mangaInfo = await this.modalController.create({
      component: modal,
      componentProps: props
    });

    mangaInfo.onDidDismiss().then((res) => {
      callbackDismiss(res);
    });

    return await mangaInfo.present();
  }

  async openPopover(popover: any, props: DataObject, event: any, callbackDismiss) {
    const mangaInfoMenu = await this.popoverController.create({
      component: popover,
      componentProps: props,
      event: event,
      translucent: true
    });

    mangaInfoMenu.onDidDismiss().then((res) => {
      callbackDismiss(res);
    });

    return await mangaInfoMenu.present();
  }

  async alertConfirmation(title: String, htmlMessage: string, callbackSuccess) {
    const alert = await this.alertController.create({
      header: `${title}`,
      message: htmlMessage,
      buttons: [
        {
          text: 'Retour',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
            callbackSuccess()
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet(title: string, callbackDismiss, buttons = []) {
    console.log(buttons)
    const actionSheet = await this.actionSheetController.create({
      header: `${title}`,
      buttons: buttons.concat([{
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Close clicked');
        }
      }])
    });

    actionSheet.onDidDismiss().then((res) => {
      callbackDismiss(res)
    })

    await actionSheet.present();
  }

}
