
import { Directive, ElementRef, Input, Output, HostListener, AfterViewInit, EventEmitter, NgZone } from '@angular/core';
import { GestureController } from '@ionic/angular';

import { DataObject } from './../../services/objects';

@Directive({
  selector: '[longTap]'
})
export class LongTapDirective implements AfterViewInit {

  @Output() longPress = new EventEmitter();
  @Input() delay: number = 500;

  private longPressActive: boolean = false;
  private action = null;

  constructor(
    private el: ElementRef,
    private gestureController: GestureController,
    private zone: NgZone
  ) { }

  ngAfterViewInit() {
    const gesture = this.gestureController.create({
      el: this.el.nativeElement,
      threshold: 0,
      gestureName: 'long-tap-gesture',
      onStart: ev => {
        this.startPressing()
      },
      onEnd: ev => {
        this.endPressing()
      }
    });
    gesture.enable(true);
  }

  private resultToSend(): DataObject {
    return {
      action: 'long-press'
    }
  }

  startPressing() {
    this.longPressActive = true;
    if (this.action) {
      clearTimeout(this.action)
    }
    this.action = setTimeout(() => {
      this.zone.run(() => {
        if (this.longPressActive) {
          this.endPressing()
          this.longPress.emit(
            this.resultToSend()
          );
        }
      });
    }, this.delay)
  }

  endPressing() {
    this.longPressActive = false;
  }

}
