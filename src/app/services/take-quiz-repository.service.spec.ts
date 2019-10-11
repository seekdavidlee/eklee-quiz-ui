import { TestBed } from '@angular/core/testing';

import { TakeQuizRepositoryService } from './take-quiz-repository.service';

describe('TakeQuizRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TakeQuizRepositoryService = TestBed.get(TakeQuizRepositoryService);
    expect(service).toBeTruthy();
  });
});
