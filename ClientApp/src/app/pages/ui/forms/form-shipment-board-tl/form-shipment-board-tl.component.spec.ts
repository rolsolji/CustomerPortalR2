import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormShipmentBoardTlComponent } from './form-shipment-board-tl.component';

describe('FormShipmentBoardTlComponent', () => {
  let component: FormShipmentBoardTlComponent;
  let fixture: ComponentFixture<FormShipmentBoardTlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormShipmentBoardTlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormShipmentBoardTlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
