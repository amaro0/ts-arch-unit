import { Context, Id } from '../../../common/types';
import { CreateUserMetaCommand } from './models/CreateUserMetaCommand';
import { ICreateUserMeta } from './ports/ICreateUserMeta';

export class CreateUserMetaCommandHandler implements ICreateUserMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserMetaCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}
