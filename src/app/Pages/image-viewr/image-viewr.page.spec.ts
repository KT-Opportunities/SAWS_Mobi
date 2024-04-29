import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageViewrPage } from './image-viewr.page';

describe('ImageViewrPage', () => {
  let component: ImageViewrPage;
  let fixture: ComponentFixture<ImageViewrPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ImageViewrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
