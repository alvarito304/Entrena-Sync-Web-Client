import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenBackBodySvgComponent } from './men-back-body-svg.component';

describe('MenBackBodySvgComponent', () => {
  let component: MenBackBodySvgComponent;
  let fixture: ComponentFixture<MenBackBodySvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenBackBodySvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenBackBodySvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
