import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAlertDialogComponent } from './confirm-alert-dialog.component';

describe('ConfirmAlertDialogComponent', () => {
  let component: ConfirmAlertDialogComponent;
  let fixture: ComponentFixture<ConfirmAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
