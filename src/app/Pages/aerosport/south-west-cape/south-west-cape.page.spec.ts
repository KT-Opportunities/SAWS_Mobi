import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SouthWestCapePage } from './south-west-cape.page';

describe('SouthWestCapePage', () => {
  let component: SouthWestCapePage;
  let fixture: ComponentFixture<SouthWestCapePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SouthWestCapePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
