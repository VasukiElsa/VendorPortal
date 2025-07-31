import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAgingComponent } from './vendor-aging.component';

describe('VendorAgingComponent', () => {
  let component: VendorAgingComponent;
  let fixture: ComponentFixture<VendorAgingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorAgingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
