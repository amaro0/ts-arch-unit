import { Context, Id } from '../../../../common/types';
import { CreateUserCommand } from '../models/CreateUserCommand';

export interface ICreateUser {
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id>;
}
