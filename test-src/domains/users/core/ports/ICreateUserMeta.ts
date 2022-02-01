import { Context, Id } from '../../../../common/types';
import { CreateUserMetaCommand } from '../models/CreateUserMetaCommand';

export interface ICreateUserMeta {
  handle(command: CreateUserMetaCommand, ctx?: Context): Promise<Id>;
}
