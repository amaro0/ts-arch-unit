import { expect } from 'chai';

import { classes } from '../src';

describe('classes', () => {
  const expectedError = new Error('Expected error');

  describe('haveMatchingName', () => {
    it('should pass on correct class', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler');
    });

    it('should find by regexp', async () => {
      classes().that().haveMatchingName(/CommandHandler/);
    });

    it('should throw non declared class', async () => {
      try {
        classes().that().haveMatchingName('bread');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInDirectory', () => {
    it('should pass on correct directory', async () => {
      classes().that().resideInDirectory('app');
    });

    it('should find by regexp', async () => {
      classes().that().resideInDirectory(/\S\/domains\/[\S]+\/app/);
    });

    it('should throw non declared class', async () => {
      try {
        classes().that().resideInDirectory('non-existing');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });
});
