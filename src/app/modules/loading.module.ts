
export class LoadingModule {

  protected waiting: boolean = false;

  protected beginWaiting() {
    this.waiting = true;
  }

  protected endWaiting() {
    this.waiting = false;
  }

  protected InWaiting() {
    return this.waiting;
  }

}
