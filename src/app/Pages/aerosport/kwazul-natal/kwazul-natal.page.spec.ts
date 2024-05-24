import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KwazulNatalPage } from './kwazul-natal.page';

describe('KwazulNatalPage', () => {
  let component: KwazulNatalPage;
  let fixture: ComponentFixture<KwazulNatalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(KwazulNatalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
