import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercisesControllPanelComponent } from './exercises-controll-panel.component';

describe('ExercisesControllPanelComponent', () => {
  let component: ExercisesControllPanelComponent;
  let fixture: ComponentFixture<ExercisesControllPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercisesControllPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercisesControllPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
