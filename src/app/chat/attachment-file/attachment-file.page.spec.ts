import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachmentFilePage } from './attachment-file.page';

describe('AttachmentFilePage', () => {
  let component: AttachmentFilePage;
  let fixture: ComponentFixture<AttachmentFilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AttachmentFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
