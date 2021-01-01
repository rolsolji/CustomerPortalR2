import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBarChartComponent } from './widget-bar-chart.component';

describe('WidgetBarChartComponent', () => {
  let component: WidgetBarChartComponent;
  let fixture: ComponentFixture<WidgetBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
