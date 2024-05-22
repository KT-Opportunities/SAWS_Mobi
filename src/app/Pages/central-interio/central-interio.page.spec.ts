import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CentralInterioPage } from './central-interio.page';

describe('CentralInterioPage', () => {
  let component: CentralInterioPage;
  let fixture: ComponentFixture<CentralInterioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CentralInterioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
