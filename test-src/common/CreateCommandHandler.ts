import { Context, Id } from './types';

export abstract class CreateCommandHandler<TCommand> {
  abstract handle(command: TCommand, context?: Context): Promise<Id>;
}
