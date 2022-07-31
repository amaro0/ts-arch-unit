import { expect } from 'chai';

import { classes } from '../src';

describe('classes', () => {
  const expectedError = new Error('Expected error');

  describe('haveMatchingName', () => {
    it('should pass on correct class', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').shouldExist();
    });

    it('should find by regexp', async () => {
      classes().that().haveMatchingName(/CommandHandler/).shouldExist();
    });

    it('should throw non declared class', async () => {
      try {
        classes().that().haveMatchingName('bread').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInDirectory', () => {
    it('should pass on correct directory', async () => {
      classes().that().resideInADirectory('app').shouldExist();
    });

    it('should throw non declared class', async () => {
      try {
        classes().that().resideInADirectory('non-existing').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInAPath', () => {
    it('should find by regexp', async () => {
      classes().that().resideInAPath(/\S\/domains\/[\S]+\/app/).shouldExist();
    });

    it('should throw non existing path class', async () => {
      try {
        classes().that().resideInAPath('non-existing').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });
});
