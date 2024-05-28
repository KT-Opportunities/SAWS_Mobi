import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorCodedSigmentAirmetComponent } from './color-coded-sigment-airmet.component';

describe('ColorCodedSigmentAirmetComponent', () => {
  let component: ColorCodedSigmentAirmetComponent;
  let fixture: ComponentFixture<ColorCodedSigmentAirmetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorCodedSigmentAirmetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorCodedSigmentAirmetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
