import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphicalSigmetAirmetComponent } from './graphical-sigmet-airmet.component';

describe('GraphicalSigmetAirmetComponent', () => {
  let component: GraphicalSigmetAirmetComponent;
  let fixture: ComponentFixture<GraphicalSigmetAirmetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicalSigmetAirmetComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphicalSigmetAirmetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
