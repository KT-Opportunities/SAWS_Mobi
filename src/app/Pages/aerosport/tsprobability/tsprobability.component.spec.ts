import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TSProbabilityPage } from './tsprobability.component';

describe('TSProbabilityPage', () => {
  let component: TSProbabilityPage;
  let fixture: ComponentFixture<TSProbabilityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TSProbabilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
