import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TafAccuracyPage } from './taf-accuracy.page';

describe('TafAccuracyPage', () => {
  let component: TafAccuracyPage;
  let fixture: ComponentFixture<TafAccuracyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TafAccuracyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
