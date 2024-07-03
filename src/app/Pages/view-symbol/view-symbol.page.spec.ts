import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSymbolPage } from './view-symbol.page';

describe('ViewSymbolPage', () => {
  let component: ViewSymbolPage;
  let fixture: ComponentFixture<ViewSymbolPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewSymbolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
