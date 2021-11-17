import { Context, Id } from '../../../common/types';
import { CreateUserCommand } from './models/CreateUserCommand';
import { ICreateUser } from './ports/ICreateUser';

export class CreateUserCommandHandler implements ICreateUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}
