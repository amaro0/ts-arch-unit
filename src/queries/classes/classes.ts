import { bootstrap } from '../../index';
import { Token } from '../../types';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

const projectMetaCrawler = bootstrap();

export function selectClass(name: Token): ClassesQueryBuilder {
  const classDeclaration = projectMetaCrawler.getClassByName(name);

  if (!classDeclaration) throw new Error(`Class ${name} not declared`);

  return new ClassesQueryBuilder([classDeclaration], projectMetaCrawler);
}
