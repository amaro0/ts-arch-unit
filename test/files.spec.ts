import { expect } from 'chai';

import { classes, files } from '../src';
import { UsersController } from '../test-src/domains/users/app/UsersController';

describe('files', () => {
  const expectedError = new Error('Expected error');

  describe('haveMatchingName', () => {
    it('should pass on existing file name', () => {
      files().that().haveMatchingName('CreateUserCommandHandler.ts').shouldExist();
    });

    it('should find by regexp', () => {
      files()
        .that()
        .haveMatchingName(/CommandHandler/)
        .shouldExist();
    });

    it('should throw non declared class', () => {
      try {
        files().that().haveMatchingName('bread').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass on existing file name assert', () => {
      files()
        .that()
        .resideInADirectory('services')
        .should()
        .haveMatchingName(/[A-Za-z]+Service.ts/);
    });

    it('should throw incorrect file name assert', () => {
      try {
        files()
          .that()
          .resideInADirectory('repositories')
          .should()
          .haveMatchingName(/[A-Za-z]+Service.ts/);
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInADirectory', () => {
    it('should pass when file is in dir', () => {
      files().resideInADirectory('core').shouldExist();
    });

    it('should search dirs by regex', () => {
      files().that().resideInADirectory(/core/).shouldExist();
    });

    it('should assert that no directory exists', () => {
      try {
        files().that().resideInADirectory('non-existing').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should combine files with matching name', () => {
      try {
        files().that().haveMatchingName('types.ts').resideInADirectory('not-common').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass on correct dir assert', () => {
      files()
        .that()
        .haveMatchingName(/[A-Za-z]+Service.ts/)
        .should()
        .resideInADirectory('services');
    });

    it('should throw incorrect dir assert', () => {
      try {
        files()
          .that()
          .haveMatchingName(/[A-Za-z]+Service.ts/)
          .should()
          .resideInADirectory('repositories');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass on negated incorrect dir assert', () => {
      files()
        .that()
        .haveMatchingName(/[A-Za-z]+Service.ts/)
        .should()
        .not()
        .resideInADirectory('repositories');
    });
  });

  describe('resideInAPath', () => {
    it('should pass when file is in path', () => {
      files()
        .resideInAPath(/\/layered\/services\//)
        .shouldExist();
    });

    it('should pass when file is in path using string', () => {
      files().resideInAPath('/layered/services').shouldExist();
    });

    it('should fail for incomplete path', () => {
      try {
        files().resideInAPath('/services').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should work with assert mode', () => {
      files()
        .that()
        .haveMatchingName('CorrectLayerService.ts')
        .should()
        .resideInAPath('/layered/services');
    });

    it('should work with negated assert mode', () => {
      files()
        .that()
        .haveMatchingName('CorrectLayerController.ts')
        .should()
        .not()
        .resideInAPath('/layered/services');
    });
  });

  describe('dependOn', () => {
    it('should pass on dependency reside in check', () => {
      files()
        .that()
        .resideInADirectory('controllers')
        .should()
        .dependOnFiles()
        .that()
        .resideInADirectory('services');
    });

    it('should pass on dependency not reside in check', () => {
      files()
        .that()
        .resideInADirectory('controllers')
        .should()
        .not()
        .dependOnFiles()
        .that()
        .resideInADirectory('repositories');
    });

    it('should throw on dependency not reside in check', () => {
      try {
        files()
          .that()
          .resideInADirectory('controllers')
          .should()
          .dependOnFiles()
          .that()
          .resideInADirectory('repositories');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass dependency has matching name check', () => {
      files()
        .that()
        .resideInADirectory('controllers')
        .should()
        .not()
        .dependOnFiles()
        .that()
        .haveMatchingName('/Repository/');
    });

    it('should on dependency has matching name check', () => {
      try {
        files()
          .that()
          .resideInADirectory('controllers')
          .should()
          .dependOnFiles()
          .that()
          .haveMatchingName('/Repository/');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should assert with path', () => {
      files()
        .that()
        .haveMatchingName('CorrectLayerController.ts')
        .should()
        .dependOnFiles()
        .that()
        .resideInAPath('/layered/services');
    });
  });

  describe('exportClass', () => {
    it('should pass for filter query', () => {
      files().that().haveMatchingName('CorrectLayerService.ts').and().exportClass().shouldExist();
    });

    it('should fail for incorrect filter query', () => {
      try {
        files().that().haveMatchingName('types.ts').and().exportClass().shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for assert query', () => {
      files().that().haveMatchingName('CorrectLayerService.ts').should().exportClass();
    });

    it('should fail for incorrect assert query', () => {
      try {
        files().that().haveMatchingName('types.ts').should().exportClass();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for not query', () => {
      files().that().haveMatchingName('types.ts').should().not().exportClass();
    });
  });

  describe('exportInterface', () => {
    it('should pass for filter query', () => {
      files().that().haveMatchingName('ICreateUser.ts').and().exportInterface().shouldExist();
    });

    it('should fail for incorrect filter query', () => {
      try {
        files().that().haveMatchingName('types.ts').and().exportInterface().shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for assert query', () => {
      files().that().haveMatchingName('ICreateUser.ts').should().exportInterface();
    });

    it('should fail for incorrect assert query', () => {
      try {
        files().that().haveMatchingName('types.ts').should().exportInterface();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for not query', () => {
      files().that().haveMatchingName('types.ts').should().not().exportInterface();
    });
  });

  describe('exportType', () => {
    it('should pass for filter query', () => {
      files().that().haveMatchingName('types.ts').and().exportType().shouldExist();
    });

    it('should fail for incorrect filter query', () => {
      try {
        files().that().haveMatchingName('ICreateUser.ts').and().exportType().shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for assert query', () => {
      files().that().haveMatchingName('types.ts').should().exportType();
    });

    it('should fail for incorrect assert query', () => {
      try {
        files().that().haveMatchingName('ICreateUser.ts').should().exportType();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for not query', () => {
      files().that().haveMatchingName('ICreateUser.ts').should().not().exportType();
    });
  });

  describe('exportSymbol', () => {
    it('should pass for filter query', () => {
      files().that().haveMatchingName('types.ts').and().exportSymbol().shouldExist();
    });

    it('should fail for incorrect filter query', () => {
      try {
        files().that().haveMatchingName('ICreateUser.ts').and().exportSymbol().shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for assert query', () => {
      files().that().haveMatchingName('types.ts').should().exportSymbol();
    });

    it('should fail for incorrect assert query', () => {
      try {
        files().that().haveMatchingName('ICreateUser.ts').should().exportSymbol();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass for not exported symbol', () => {
      files().that().haveMatchingName('nothingExported.ts').should().not().exportSymbol();
    });
  });

  describe('exportFunc', () => {
    describe('arrow', () => {
      it('should pass for filter query', () => {
        files()
          .that()
          .haveMatchingName('exportedArrowFunc.ts')
          .and()
          .exportFunction()
          .shouldExist();
      });

      it('should fail for incorrect filter query', () => {
        try {
          files().that().haveMatchingName('ICreateUser.ts').and().exportFunction().shouldExist();
          throw expectedError;
        } catch (e) {
          expect(e).not.to.eq(expectedError);
        }
      });

      it('should pass for assert query', () => {
        files().that().haveMatchingName('exportedArrowFunc.ts').should().exportFunction();
      });

      it('should fail for incorrect assert query', () => {
        try {
          files().that().haveMatchingName('ICreateUser.ts').should().exportFunction();
          throw expectedError;
        } catch (e) {
          expect(e).not.to.eq(expectedError);
        }
      });

      it('should pass for not exported symbol', () => {
        files().that().haveMatchingName('nothingExported.ts').should().not().exportFunction();
      });
    });

    describe('normal', () => {
      it('should pass for filter query', () => {
        files().that().haveMatchingName('exportedFunc.ts').and().exportFunction().shouldExist();
      });

      it('should fail for incorrect filter query', () => {
        try {
          files().that().haveMatchingName('ICreateUser.ts').and().exportFunction().shouldExist();
          throw expectedError;
        } catch (e) {
          expect(e).not.to.eq(expectedError);
        }
      });

      it('should pass for assert query', () => {
        files().that().haveMatchingName('exportedFunc.ts').should().exportFunction();
      });

      it('should fail for incorrect assert query', () => {
        try {
          files().that().haveMatchingName('ICreateUser.ts').should().exportFunction();
          throw expectedError;
        } catch (e) {
          expect(e).not.to.eq(expectedError);
        }
      });

      it('should pass for not exported symbol', () => {
        files().that().haveMatchingName('nothingExported.ts').should().not().exportFunction();
      });
    });
  });

  describe('excludedByMatchingName', () => {
    it('should exclude many', async () => {
      try {
        files()
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
      files()
        .that()
        .haveMatchingName(/CommandHandler/)
        .and()
        .are()
        .excludedByMatchingName('CreateUserCommandHandler')
        .shouldExist();
    });
  });

  describe('excludedByPath', () => {
    it('should exclude all', async () => {
      try {
        files()
          .that()
          .haveMatchingName(/CommandHandler/)
          .and()
          .are()
          .excludedByPath(/\/test-src/)
          .shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should exclude only one', async () => {
      files()
        .that()
        .haveMatchingName(/UsersController/)
        .and()
        .are()
        .excludedByPath(/\/domains\/users\/app/)
        .shouldNotExist();
    });
  });
});
