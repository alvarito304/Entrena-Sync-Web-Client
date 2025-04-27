import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanBodyPageComponent } from './human-body-page.component';

describe('HumanBodyPageComponent', () => {
  let component: HumanBodyPageComponent;
  let fixture: ComponentFixture<HumanBodyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumanBodyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumanBodyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
