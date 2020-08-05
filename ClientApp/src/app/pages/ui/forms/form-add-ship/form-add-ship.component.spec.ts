import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddShipComponent } from './form-add-ship.component';

describe('FormAddShipComponent', () => {
  let component: FormAddShipComponent;
  let fixture: ComponentFixture<FormAddShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAddShipComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
