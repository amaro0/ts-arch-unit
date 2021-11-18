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

  describe('ClassQueryBuilder', () => {
    describe('resideInADirectory', () => {
      it('should pass on directory', async () => {
        const c = await selectClass('CreateUserCommandHandler');

        c.should().resideInADirectory('core');
      });

      it('should throw non wrong directory', async () => {
        try {
          const c = await selectClass('CreateUserCommandHandler');

          c.should().resideInADirectory('wrong');
          throw expectedError;
        } catch (e) {
          expect(e).not.toEqual(expectedError);
        }
      });
    });

    describe('not', () => {
      it('should properly negate statement', async () => {
        const c = await selectClass('CreateUserCommandHandler');

        c.should().not().resideInADirectory('wrong');
      });
    });
  });
});
