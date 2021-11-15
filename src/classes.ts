import { bootstrap } from './index';

export async function selectClass(name: string): Promise<void>{
  const projectMetaCrawler = await bootstrap();

  const classDeclaration = projectMetaCrawler.getClassByName(name);

  if (!classDeclaration) throw new Error(`Class ${name} not declared`);
}
