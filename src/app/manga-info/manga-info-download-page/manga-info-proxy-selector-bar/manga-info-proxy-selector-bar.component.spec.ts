import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MangaInfoProxySelectorBarComponent } from './manga-info-proxy-selector-bar.component';

describe('MangaInfoProxySelectorBarComponent', () => {
  let component: MangaInfoProxySelectorBarComponent;
  let fixture: ComponentFixture<MangaInfoProxySelectorBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MangaInfoProxySelectorBarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MangaInfoProxySelectorBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
