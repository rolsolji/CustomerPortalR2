import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShipmentBoardComponent } from './form-shipment-board.component';

describe('FormShipmentBoardComponent', () => {
  let component: FormShipmentBoardComponent;
  let fixture: ComponentFixture<FormShipmentBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormShipmentBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormShipmentBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
