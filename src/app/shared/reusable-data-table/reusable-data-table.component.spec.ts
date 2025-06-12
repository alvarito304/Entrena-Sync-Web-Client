import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDataTableComponent } from './reusable-data-table.component';

describe('ReusableDataTableComponent', () => {
  let component: ReusableDataTableComponent;
  let fixture: ComponentFixture<ReusableDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
