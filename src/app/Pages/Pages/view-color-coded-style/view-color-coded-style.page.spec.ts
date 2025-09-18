import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewColorCodedStylePage } from './view-color-coded-style.page';

describe('ViewColorCodedStylePage', () => {
  let component: ViewColorCodedStylePage;
  let fixture: ComponentFixture<ViewColorCodedStylePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewColorCodedStylePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
