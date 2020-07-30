import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddShipmentComponent } from './form-add-shipment.component';

describe('FormAddShipmentComponent', () => {
  let component: FormAddShipmentComponent;
  let fixture: ComponentFixture<FormAddShipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAddShipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
