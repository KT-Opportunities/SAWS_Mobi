import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SynopticAnalysisPage } from './synoptic-analysis.page';

describe('SynopticAnalysisPage', () => {
  let component: SynopticAnalysisPage;
  let fixture: ComponentFixture<SynopticAnalysisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SynopticAnalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
