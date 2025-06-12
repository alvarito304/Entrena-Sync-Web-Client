import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerClientAdministrationComponent } from './worker-client-administration.component';

describe('WorkerClientAdministrationComponent', () => {
  let component: WorkerClientAdministrationComponent;
  let fixture: ComponentFixture<WorkerClientAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerClientAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerClientAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
