import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMemoComponent } from './vendor-memo.component';

describe('VendorMemoComponent', () => {
  let component: VendorMemoComponent;
  let fixture: ComponentFixture<VendorMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMemoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
