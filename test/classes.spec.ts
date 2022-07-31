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

    it('should pass on correct matching name assert', async () => {
      classes().that().resideInADirectory('services').should().haveMatchingName(/[A-Za-z]+Service/);
    });

    it('should throw on wrong name assert', async () => {
      try {
        classes().that().resideInADirectory('services').should().haveMatchingName('wrong');
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

    it('should pass on assert directory', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should().resideInADirectory('core');
    });

    it('should throw on assert for wrong directory', async () => {
      try {
        classes().that().haveMatchingName('CreateUserCommandHandler').should().resideInADirectory('wrong');
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

  describe('not', () => {
    it('should properly negate statement', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should()
        .not().resideInADirectory('wrong');
    });

    it('should properly double negate statement', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should()
        .not().not().resideInADirectory('core');
    });
  });

  describe('implementInterface', () => {
    it('should pass on correct interface', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should().implementInterface('ICreateUser');
    });

    it('should pass on correct interface by regex', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should().implementInterface(/ICreate/);
    });

    it('should pass inline interface', async () => {
      classes().that().haveMatchingName('InlineCreateUserCommandHandler')
        .should().implementInterface(/ICreate/);
    });

    it('should throw on wrong interface', async () => {
      try {
        classes().that().haveMatchingName('CreateUserCommandHandler').should().implementInterface('wrong');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('extendClass', () => {
    it('should pass on any extend', async () => {
      classes().that().haveMatchingName('UsersController').should().extendClass();
    });

    it('should pass on token extend', async () => {
      classes().that().haveMatchingName('UsersController').should().extendClass('Controller');
    });

    it('should throw on wrong extend when class extends nothing', async () => {
      try {
        classes().that().haveMatchingName(/Controller/).should().extendClass('Controller');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should throw on wrong extend', async () => {
      try {
        classes().that().haveMatchingName('UsersController').should().extendClass(/ShouldThrow/);
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });
});
