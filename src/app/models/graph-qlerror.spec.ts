import { GraphQLError } from './graph-qlerror';

describe('GraphQLError', () => {
  it('should create an instance', () => {
    expect(new GraphQLError()).toBeTruthy();
  });
});
