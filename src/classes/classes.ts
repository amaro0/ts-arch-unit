import { bootstrap } from '../index';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

export async function selectClass(name: string | RegExp): Promise<ClassesQueryBuilder>{
  const projectMetaCrawler = await bootstrap();

  const classDeclaration = projectMetaCrawler.getClassByName(name);

  if (!classDeclaration) throw new Error(`Class ${name} not declared`);

  return new ClassesQueryBuilder([classDeclaration]);
}
