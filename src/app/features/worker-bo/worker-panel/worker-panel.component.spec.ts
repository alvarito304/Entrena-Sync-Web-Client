import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerPanelComponent } from './worker-panel.component';

describe('WorkerPanelComponent', () => {
  let component: WorkerPanelComponent;
  let fixture: ComponentFixture<WorkerPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
