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
});
