import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHireServicesComponent } from './my-hire-services.component';

describe('MyHireServicesComponent', () => {
  let component: MyHireServicesComponent;
  let fixture: ComponentFixture<MyHireServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyHireServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyHireServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
