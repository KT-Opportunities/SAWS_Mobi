import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AeroImageViewerPage } from './aero-image-viewer.page';

describe('AeroImageViewerPage', () => {
  let component: AeroImageViewerPage;
  let fixture: ComponentFixture<AeroImageViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AeroImageViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
