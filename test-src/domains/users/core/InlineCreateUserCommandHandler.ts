type Context = {};

type Id = string;

class CreateUserCommand {

}

interface ICreateUser {
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id>;
}

interface IDep {
  go(): void;
}

class Dep implements IDep {
  go(): void {
  }
}

export class InlineCreateUserCommandHandler implements ICreateUser {
  constructor(
    private someDep: IDep,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}

export class WrongInlineCreateUserCommandHandler implements ICreateUser {
  constructor(
    private someDep: Dep,
  ) {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(command: CreateUserCommand, ctx?: Context): Promise<Id> {
    return Promise.resolve('123');
  }
}
