import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenBodySvgComponent } from './men-body-svg.component';

describe('MenBodySvgComponent', () => {
  let component: MenBodySvgComponent;
  let fixture: ComponentFixture<MenBodySvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenBodySvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenBodySvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
