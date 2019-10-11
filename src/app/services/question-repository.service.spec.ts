import { TestBed } from '@angular/core/testing';

import { QuestionRepositoryService } from './question-repository.service';

describe('QuestionRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionRepositoryService = TestBed.get(QuestionRepositoryService);
    expect(service).toBeTruthy();
  });
});
