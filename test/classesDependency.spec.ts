import { expect } from 'chai';

import { classes } from '../src/queries/classes/classes';

describe('classesDependency', () => {
  const expectedError = new Error('Expected error');

  describe('onAnyConcreteImplementation', () => {
    it('should pass on correct class', async () => {
      classes().that().haveMatchingName('InlineCreateUserCommandHandler').should()
        .not().depend().onAnyConcreteImplementation();
    });

    it('should pass on correct class when dep is imported', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should()
        .not().depend().onAnyConcreteImplementation();
    });

    it('should throw error on class that depends on concrete implementation', async () => {
      try {
        classes().that().haveMatchingName('WrongInlineCreateUserCommandHandler').should()
          .not().depend().onAnyConcreteImplementation();
        throw expectedError;
      } catch (e) {
        expect(e).to.not.be.eq(expectedError);
      }
    });

    it('should throw error on class that depends on concrete implementation when dep is imported', async () => {
      try {
        classes().that().haveMatchingName('WrongCreateUserCommandHandler').should()
          .not().depend().onAnyConcreteImplementation();
        throw expectedError;
      } catch (e) {
        expect(e).to.not.be.eq(expectedError);
      }
    });
  });

  describe('onInterfaces', () => {
    it('should pass on correct class', async () => {
      classes().that().haveMatchingName('InlineCreateUserCommandHandler').should()
        .depend().onInterfaces();
    });

    it('should pass on correct class when dep is imported', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').should()
        .depend().onInterfaces();
    });

    it('should throw error on class that depends on concrete implementation', async () => {
      try {
        classes().that().haveMatchingName('WrongInlineCreateUserCommandHandler').should()
          .depend().onInterfaces();
        throw expectedError;
      } catch (e) {
        expect(e).to.not.be.eq(expectedError);
      }
    });

    it('should throw error on class that depends on concrete implementation when dep is imported', async () => {
      try {
        classes().that().haveMatchingName('WrongCreateUserCommandHandler').should()
          .depend().onInterfaces();
        throw expectedError;
      } catch (e) {
        expect(e).to.not.be.eq(expectedError);
      }
    });
  });
});
