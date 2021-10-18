
import { DataObject } from './../services/objects';

export abstract class SynchroniserSuperTabs {

  private nbTotalTabs: number = 3;
  private currentTabCharged: number = 0;

  private tabs: DataObject = {};

  synchroniseTab(tab) {
    console.log(tab)
    this.tabs[tab.keyName] = tab.comp;

    this.currentTabCharged += 1;
    if (this.currentTabCharged >= this.nbTotalTabs) {
      this.afterAllTabCharged();
    }
  }

  public getTab(tabName) {
    return this.tabs[tabName];
  }

  public getPages(pageName) {
    return this.tabs[pageName]; //same things but will forget in future
  }

  public afterAllTabCharged(): void {
    console.log("all tab charged"); //could be overwritten
  };

}
