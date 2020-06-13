import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQuickQuoteComponent } from './form-quick-quote.component';

describe('FormQuickQuoteComponent', () => {
  let component: FormQuickQuoteComponent;
  let fixture: ComponentFixture<FormQuickQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormQuickQuoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQuickQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
