import { expect } from 'chai';

import { classes } from '../src';

describe('classes', () => {
  const expectedError = new Error('Expected error');

  describe('haveMatchingName', () => {
    it('should pass on correct class', async () => {
      classes().that().haveMatchingName('CreateUserCommandHandler').shouldExist();
    });

    it('should find by regexp', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .shouldExist();
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
      classes()
        .that()
        .resideInADirectory('services')
        .should()
        .haveMatchingName(/[A-Za-z]+Service/);
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
      classes()
        .that()
        .haveMatchingName('CreateUserCommandHandler')
        .should()
        .resideInADirectory('core');
    });

    it('should throw on assert for wrong directory', async () => {
      try {
        classes()
          .that()
          .haveMatchingName('CreateUserCommandHandler')
          .should()
          .resideInADirectory('wrong');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInAPath', () => {
    it('should find by regexp', async () => {
      classes()
        .that()
        .resideInAPath(/\S\/domains\/[\S]+\/app/)
        .shouldExist();
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
      classes()
        .that()
        .haveMatchingName('CreateUserCommandHandler')
        .should()
        .not()
        .resideInADirectory('wrong');
    });

    it('should properly double negate statement', async () => {
      classes()
        .that()
        .haveMatchingName('CreateUserCommandHandler')
        .should()
        .not()
        .not()
        .resideInADirectory('core');
    });
  });

  describe('implementInterface', () => {
    it('should pass on correct interface', async () => {
      classes()
        .that()
        .haveMatchingName('CreateUserCommandHandler')
        .should()
        .implementInterface('ICreateUser');
    });

    it('should pass on correct interface by regex', async () => {
      classes()
        .that()
        .haveMatchingName('CreateUserCommandHandler')
        .should()
        .implementInterface(/ICreate/);
    });

    it('should pass inline interface', async () => {
      classes()
        .that()
        .haveMatchingName('InlineCreateUserCommandHandler')
        .should()
        .implementInterface(/ICreate/);
    });

    it('should throw on wrong interface', async () => {
      try {
        classes()
          .that()
          .haveMatchingName('CreateUserCommandHandler')
          .should()
          .implementInterface('wrong');
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
        classes()
          .that()
          .haveMatchingName(/Controller/)
          .should()
          .extendClass('Controller');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should throw on wrong extend', async () => {
      try {
        classes()
          .that()
          .haveMatchingName('UsersController')
          .should()
          .extendClass(/ShouldThrow/);
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('excludedByMatchingName', () => {
    it('should exclude many', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .and()
          .are()
          .excludedByMatchingName(/CommandHandler/)
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should exclude only one', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .are()
        .excludedByMatchingName('CreateUserCommandHandler')
        .shouldExist();
    });
  });

  describe('haveMatchingMethod', () => {
    it('should filter classes is method is absent', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .and()
          .haveMatchingMethod(/wrongMethod/)
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should not filter classes if method is present', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .haveMatchingMethod(/handle/)
        .shouldExist();
    });

    it('should pass in should mode', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .should()
        .haveMatchingMethod(/handle/);
    });

    it('should throw in should mode', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .should()
          .haveMatchingMethod(/wrongMethod/);
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('abstract', () => {
    it('should filter abstract classes', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/Service/)
          .and()
          .are()
          .abstract()
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should not filter abstract classes if method is present', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .are()
        .abstract()
        .shouldExist();
    });

    it('should pass in should mode', async () => {
      classes().that().haveMatchingName('CreateCommandHandler').should().be().abstract();
    });

    it('should throw in should mode', async () => {
      try {
        classes().that().haveMatchingName('CreateUserCommandHandler').should().be().abstract();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('haveMatchingAbstractMethod', () => {
    it('should filter classes when abstract method is absent', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .and()
          .haveMatchingAbstractMethod()
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should filter classes when abstract method is absent and token is provided', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .and()
          .haveMatchingAbstractMethod('shouldBeAbstract')
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should not filter classes if abstract method is present', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .haveMatchingAbstractMethod()
        .shouldExist();
    });

    it('should not filter classes if abstract method is present and token is provided', async () => {
      classes()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .haveMatchingAbstractMethod(/handle/)
        .shouldExist();
    });

    it('should pass in should mode', async () => {
      classes()
        .that()
        .haveMatchingName('CreateCommandHandler')
        .should()
        .haveMatchingAbstractMethod(/handle/);
    });

    it('should throw in should mode', async () => {
      try {
        classes()
          .that()
          .haveMatchingName(/CommandHandler/)
          .should()
          .haveMatchingAbstractMethod(/handle/);
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });
});
