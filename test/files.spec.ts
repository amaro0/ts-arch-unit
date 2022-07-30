import { expect } from 'chai';

import { files } from '../src/queries/files/files';

describe('files', () => {
  const expectedError = new Error('Expected error');

  describe('haveMatchingName', () => {
    it('should pass on existing file name', async () => {
      files().that().haveMatchingName('CreateUserCommandHandler.ts').shouldExist();
    });

    it('should find by regexp', async () => {
      files().that().haveMatchingName(/CommandHandler/).shouldExist();
    });

    it('should throw non declared class', async () => {
      try {
        files().that().haveMatchingName('bread').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('resideInADirectory', () => {
    it('should pass when file is in dir', async () => {
      files().resideInADirectory('core').shouldExist();
    });

    it('should search dirs by regex', async () => {
      files().that().resideInADirectory(/core/).shouldExist();
    });

    it('should assert that no directory exists', async () => {
      try {
        files().that().resideInADirectory('non-existing').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should combine files with matching name', async () => {
      try {
        files().that().haveMatchingName('types.ts').resideInADirectory('not-common').shouldExist();
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });

  describe('dependOn', () => {
    it('should pass on dependency not reside in check', async () => {
      files().that().resideInADirectory('controllers').should().not().dependOnFiles().that().resideInADirectory('repositories');
    });

    it('should throw on dependency not reside in check', async () => {
      try {
        files().that().resideInADirectory('controllers').should().dependOnFiles().that().resideInADirectory('repositories');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });

    it('should pass dependency has matching name check', async () => {
      files().that().resideInADirectory('controllers').should().not().dependOnFiles().that().haveMatchingName('/Repository/');
    });

    it('should on dependency has matching name check', async () => {
      try {
        files().that().resideInADirectory('controllers').should().dependOnFiles().that().haveMatchingName('/Repository/');
        throw expectedError;
      } catch (e) {
        expect(e).not.to.eq(expectedError);
      }
    });
  });
});
