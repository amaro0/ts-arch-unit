import { selectClass } from '../src/classes/classes';

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
        expect(e).not.toEqual(expectedError);
      }
    });
  });
});
