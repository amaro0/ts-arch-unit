import { ClassDeclaration, Directory, FunctionDeclaration, Project, SourceFile } from 'ts-morph';

import { IDiscoveredNode, Token } from './types';



export class ProjectMetaCrawler {
  private sourceFiles: SourceFile[];

  private sourceFilesMap: Map<string, SourceFile>;

  private classes: Map<string, IDiscoveredNode<ClassDeclaration[]>> = new Map();

  private classesArr: IDiscoveredNode<ClassDeclaration>[] = [];

  private functions: Map<string, IDiscoveredNode<FunctionDeclaration[]>> = new Map();

  private functionsArr: IDiscoveredNode<FunctionDeclaration>[] = [];

  private tsMorphProject: Project;

  constructor(root: string) {
    this.tsMorphProject = new Project();
    this.tsMorphProject.addSourceFilesAtPaths(`${root}/**/*{.d.ts,.ts,.js,.jsx,.tsx}`);

    this.sourceFiles = this.tsMorphProject.getSourceFiles();
    this.sourceFilesMap = new Map(this.sourceFiles.map(sf=>[sf.getBaseName(), sf]));

    this.sourceFiles.forEach((sourceFile) => {
      const sourceFileBaseName = sourceFile.getBaseName();

      const classes = sourceFile.getClasses();
      this.classes.set(sourceFileBaseName, { sourceFileBaseName, value: classes });
      this.classesArr.push(...classes.map((c) => ({ sourceFileBaseName, value: c })));

      const functions = sourceFile.getFunctions();
      this.functions.set(sourceFileBaseName, { sourceFileBaseName, value: functions });
      this.functionsArr.push(...functions.map((f) => ({ sourceFileBaseName, value: f })));
    });
  }

  getClassByName(token: Token): IDiscoveredNode<ClassDeclaration> | undefined {
    if (typeof token === 'string') {
      return this.classesArr.find((c) => c.value.getName() === token);
    }

    return this.classesArr.find((c) => token.test(c.value.getName() ?? ''));
  }

  getDirectoryForClass(node: IDiscoveredNode<ClassDeclaration> ): Directory{
    const { sourceFileBaseName } = node;

    const sourceFile = this.sourceFilesMap.get(sourceFileBaseName);
    if (!sourceFile){
      throw new Error('Source file not found');
    }

    return sourceFile.getDirectory();
  }
}
