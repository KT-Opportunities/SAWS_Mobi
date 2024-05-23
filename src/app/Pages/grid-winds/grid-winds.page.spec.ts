import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridWindsPage } from './grid-winds.page';

describe('GridWindsPage', () => {
  let component: GridWindsPage;
  let fixture: ComponentFixture<GridWindsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GridWindsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
