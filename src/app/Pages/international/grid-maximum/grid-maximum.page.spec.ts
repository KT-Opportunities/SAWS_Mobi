import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridMaximumPage } from './grid-maximum.page';

describe('GridMaximumPage', () => {
  let component: GridMaximumPage;
  let fixture: ComponentFixture<GridMaximumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GridMaximumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
