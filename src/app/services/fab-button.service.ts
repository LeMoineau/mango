
import { Injectable } from '@angular/core';

import { DataObject } from './objects';

@Injectable()
export class FabButtonService {

  private fabButtonManager: DataObject = {
    fabs: [
      {
        fabName: "edit-button",
        color: "success",
        iconName: "save",
        forPage: 0,
        onClick: () => {},
        visible: false,
        autoActive: false
      },
      {
        fabName: "delete-button",
        color: "danger",
        iconName: "trash-outline",
        forPage: 1,
        onClick: () => {},
        visible: false
      },
      {
        fabName: "download-button",
        color: "primary",
        iconName: "download-outline",
        forPage: 2,
        onClick: () => {},
        visible: false
      }
    ],
    currentPage: 0
  }

  public fabs() {
    return this.fabButtonManager.fabs;
  }

  public fabNames() {
    return this.fabButtonManager.fabs.map(c => c.fabName);
  }

  public getCurrentPage() {
    return this.fabButtonManager.currentPage;
  }

  public getFabButtonByParameter(param: string, val: any) {
    return this.fabButtonManager.fabs.find(f => f[param] === val);
  }

  public getFabButton(fabName: string) {
    return this.getFabButtonByParameter("fabName", fabName);
  }

  public setFabParameter(fabName: string, param: string, val: any) {
    let fab = this.getFabButton(fabName);
    if (fab !== undefined) {
      fab[param] = val;
    }
  }

  public setFabParameterByParameter(paramGet: string, valGet: any, param: string, val: any) {
    let fab = this.getFabButtonByParameter(paramGet, valGet);
    if (fab !== undefined) {
      fab[param] = val;
    }
  }

  public toggleFabParameter(fabName: string, param: string) {
    let fab = this.getFabButton(fabName);
    if (fab !== undefined) {
      fab[param] = !fab[param];
    }
  }

  public updateCurrentPage(pageIndex: number) {
    this.fabButtonManager.currentPage = pageIndex;
    let fab = this.getFabButtonByParameter("forPage", pageIndex);
    if (fab !== undefined && fab.autoActive === true) {
      fab.visible = true;
    }
  }

  public toggleCurrentFabVisibility(state: boolean = undefined) {
    let fab = this.getFabButtonByParameter("forPage", this.fabButtonManager.currentPage);
    if (fab !== undefined) {
      fab.visible = state === undefined ? !fab.visible : state;
    }
  }

}
