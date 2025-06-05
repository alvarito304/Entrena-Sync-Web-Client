import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerAdministrationComponent } from './worker-administration.component';

describe('WorkerAdministrationComponent', () => {
  let component: WorkerAdministrationComponent;
  let fixture: ComponentFixture<WorkerAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
