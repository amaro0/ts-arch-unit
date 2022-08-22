import { Context, Id } from '../../../common/types';
import { CreateUserCommand } from './models/CreateUserCommand';
import { ICreateUser } from './ports/ICreateUser';
import { ICreateUserMeta } from './ports/ICreateUserMeta';
import { CreateUserMetaCommand } from './models/CreateUserMetaCommand';
import { CreateCommandHandler } from '../../../common/CreateCommandHandler';

export class CreateUserCommandHandler
  extends CreateCommandHandler<CreateUserCommand>
  implements ICreateUser
{
  constructor(private createMeta: ICreateUserMeta) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}

export class WrongCreateUserCommandHandler implements ICreateUser {
  constructor(private createMeta: CreateUserMetaCommand) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}
