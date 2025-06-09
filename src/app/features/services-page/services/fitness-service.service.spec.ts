import { TestBed } from '@angular/core/testing';

import { FitnessServiceService } from './fitness-service.service';

describe('FitnessServiceService', () => {
  let service: FitnessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
