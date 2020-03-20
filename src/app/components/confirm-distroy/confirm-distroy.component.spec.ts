import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDistroyComponent } from './confirm-distroy.component';

describe('ConfirmDistroyComponent', () => {
  let component: ConfirmDistroyComponent;
  let fixture: ComponentFixture<ConfirmDistroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDistroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
