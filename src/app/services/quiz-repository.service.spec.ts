import { TestBed } from '@angular/core/testing';

import { QuizRepositoryService } from './quiz-repository.service';

describe('QuizServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuizRepositoryService = TestBed.get(QuizRepositoryService);
    expect(service).toBeTruthy();
  });
});
