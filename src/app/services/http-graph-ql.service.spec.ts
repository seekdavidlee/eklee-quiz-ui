import { TestBed } from '@angular/core/testing';

import { HttpGraphQLService } from './http-graph-ql.service';

describe('HttpGraphQLService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpGraphQLService = TestBed.get(HttpGraphQLService);
    expect(service).toBeTruthy();
  });
});
