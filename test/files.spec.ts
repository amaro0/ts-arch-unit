import { expect } from 'chai';

import { files } from "../src/queries/files/files";

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
});
