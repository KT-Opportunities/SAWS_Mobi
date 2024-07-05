import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDecodedPage } from './view-decoded.page';

describe('ViewDecodedPage', () => {
  let component: ViewDecodedPage;
  let fixture: ComponentFixture<ViewDecodedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewDecodedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
