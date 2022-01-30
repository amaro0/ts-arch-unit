type Context = {};

type Id = string;

class CreateUserCommand {

}

interface ICreateUser {
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id>;
}

export class InlineCreateUserCommandHandler implements ICreateUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}
