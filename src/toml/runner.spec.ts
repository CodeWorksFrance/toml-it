import { TestRunner } from './runner';

describe('Runner', () => {
  it('should run tests', () => {
    new TestRunner().run();
  });
});
