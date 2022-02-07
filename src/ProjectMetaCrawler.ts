import {
  ClassDeclaration,
  Directory,
  FunctionDeclaration,
  InterfaceDeclaration,
  Node,
  Project,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';

import { findDeepNode } from './astUtilities';
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
    this.sourceFilesMap = new Map(this.sourceFiles.map(sf => [sf.getBaseName(), sf]));

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

  getClassesByDirectory(token: Token): IDiscoveredNode<ClassDeclaration>[] {
    const sourceFilesInDir = typeof token === 'string'
      ? this.sourceFiles.filter((sf) => sf.getDirectoryPath().split('/').pop() === token)
      : this.sourceFiles.filter((sf) => token.test(sf.getDirectoryPath()));

    return sourceFilesInDir.flatMap(sf => {
      const sfBaseName = sf.getBaseName();
      const classes = sf.getClasses();

      return classes.map(c => ({ sourceFileBaseName: sfBaseName, value: c }));
    });
  }

  getClassesByName(token: Token): IDiscoveredNode<ClassDeclaration>[] {
    if (typeof token === 'string') {
      return this.classesArr.filter((c) => c.value.getName() === token);
    }

    return this.classesArr.filter((c) => token.test(c.value.getName() ?? ''));
  }

  getDirectoryForClass(node: IDiscoveredNode<ClassDeclaration>): Directory {
    const { sourceFileBaseName } = node;

    const sourceFile = this.sourceFilesMap.get(sourceFileBaseName);
    if (!sourceFile) {
      throw new Error('Source file not found');
    }

    return sourceFile.getDirectory();
  }

  getInterfacesForClass(discoveredNode: IDiscoveredNode<ClassDeclaration>): InterfaceDeclaration[] {
    const { value: classDeclaration } = discoveredNode;
    const interfaces: InterfaceDeclaration[] = [];

    classDeclaration.getImplements().forEach(hc => {
      const ex = hc.getExpression();
      const symbol = ex.getSymbol()?.getAliasedSymbol();

      if (!symbol) return;

      symbol.getDeclarations().forEach(d => {
        const id = findDeepNode(d, SyntaxKind.InterfaceDeclaration);

        if (id && Node.isInterfaceDeclaration(id)) interfaces.push(id);
      });
    });

    return interfaces;
  }
}
