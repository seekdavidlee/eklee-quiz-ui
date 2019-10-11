import { TestBed } from '@angular/core/testing';

import { GraphQLTemplateService } from './graphql-template.service';

describe('MutationTemplateServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQLTemplateService = TestBed.get(GraphQLTemplateService);
    expect(service).toBeTruthy();
  });
});
