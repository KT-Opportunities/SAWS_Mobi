import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LowLevelWindProfileComponent } from './low-level-wind-profile.component';

describe('LowLevelWindProfileComponent', () => {
  let component: LowLevelWindProfileComponent;
  let fixture: ComponentFixture<LowLevelWindProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LowLevelWindProfileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LowLevelWindProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
