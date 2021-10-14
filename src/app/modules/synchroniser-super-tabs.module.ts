
export abstract class SynchroniserSuperTabs {

  private nbTotalTabs: number = 3;
  private currentTabCharged: number = 0;

  synchroniseTab(tab) {
    console.log(tab)
    this[tab.keyName] = tab.comp;

    this.currentTabCharged += 1;
    if (this.currentTabCharged >= this.nbTotalTabs) {
      this.afterAllTabCharged();
    }
  }

  public abstract afterAllTabCharged(): void;

}
