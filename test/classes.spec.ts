import { expect } from 'chai';

import { selectClass } from '../src/queries/classes/classes';

describe('classes', () => {
  const expectedError = new Error('Expected error');

  describe('selectClass', () => {
    it('should pass on correct class', async () => {
      await selectClass('CreateUserCommandHandler');
    });

    it('should find by regexp', async () => {
      await selectClass(/CommandHandler/);
    });

    it('should throw non declared class', async () => {
      try {
        await selectClass('bread');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('ClassQueryBuilder', () => {
    describe('resideInADirectory', () => {
      it('should pass on directory', async () => {
        selectClass('CreateUserCommandHandler').should().resideInADirectory('core');
      });

      it('should throw non wrong directory', async () => {
        try {
          selectClass('CreateUserCommandHandler').should().resideInADirectory('wrong');
          throw expectedError;
        } catch (e) {
          expect(e).not.to.eq(expectedError);
        }
      });
    });

    describe('not', () => {
      it('should properly negate statement', async () => {
        selectClass('CreateUserCommandHandler').should()
          .not().resideInADirectory('wrong');
      });

      it('should properly double negate statement', async () => {
        selectClass('CreateUserCommandHandler').should()
          .not().not().resideInADirectory('core');
      });
    });
  });
});
