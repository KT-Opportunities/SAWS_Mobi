import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarmonizedGridPage } from './harmonized-grid.page';

describe('HarmonizedGridPage', () => {
  let component: HarmonizedGridPage;
  let fixture: ComponentFixture<HarmonizedGridPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HarmonizedGridPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
