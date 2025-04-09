import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingconfiguratorComponent } from './floatingconfigurator.component';

describe('FloatingconfiguratorComponent', () => {
  let component: FloatingconfiguratorComponent;
  let fixture: ComponentFixture<FloatingconfiguratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingconfiguratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingconfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
