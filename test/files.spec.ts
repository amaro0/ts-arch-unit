import { expect } from 'chai';

import { files } from '../src';

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

  describe('dependOn', () => {
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
  });

  describe('exportInterface', () => {
    it('should pass for filter query', () => {
      files().that().haveMatchingName('ICreateUser.ts').and().exportInterface().shouldExist();
    });

    it('should fail for incorrect filter query', () => {
      try {
        files().that().haveMatchingName('types').and().exportInterface().shouldExist();
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
  });
});
