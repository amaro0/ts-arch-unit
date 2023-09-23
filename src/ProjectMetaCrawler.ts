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
import { IDiscoveredNode } from './types';

export class ProjectMetaCrawler {
  sourceFiles: SourceFile[];

  private sourceFilesMap: Map<string, SourceFile>;

  private classes: Map<string, IDiscoveredNode<ClassDeclaration[]>> = new Map();

  classesArr: IDiscoveredNode<ClassDeclaration>[] = [];

  private functions: Map<string, IDiscoveredNode<FunctionDeclaration[]>> = new Map();

  private functionsArr: IDiscoveredNode<FunctionDeclaration>[] = [];

  private tsMorphProject: Project;

  constructor(private readonly root: string) {
    this.tsMorphProject = new Project();
    this.tsMorphProject.addSourceFilesAtPaths(`${root}/**/*{.d.ts,.ts,.js,.jsx,.tsx}`);

    this.sourceFiles = this.tsMorphProject.getSourceFiles();
    this.sourceFilesMap = new Map(this.sourceFiles.map((sf) => [sf.getBaseName(), sf]));

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

  get rootPath(): string {
    return this.root;
  }

  getDirectoryForClass(node: IDiscoveredNode<ClassDeclaration>): Directory {
    const { sourceFileBaseName } = node;

    const sourceFile = this.sourceFilesMap.get(sourceFileBaseName);

    if (!sourceFile) {
      throw new Error('getDirectoryForClass Source file not found');
    }

    return sourceFile.getDirectory();
  }

  getInterfacesForClass(discoveredNode: IDiscoveredNode<ClassDeclaration>): InterfaceDeclaration[] {
    const { value: classDeclaration } = discoveredNode;
    const interfaces: InterfaceDeclaration[] = [];

    classDeclaration.getImplements().forEach((hc) => {
      const ex = hc.getExpression();
      const symbol = ex.getSymbol()?.getAliasedSymbol();

      if (!symbol) return;

      symbol.getDeclarations().forEach((d) => {
        const id = findDeepNode(d, SyntaxKind.InterfaceDeclaration);

        if (id && Node.isInterfaceDeclaration(id)) interfaces.push(id);
      });
    });

    return interfaces;
  }

  getSourceFileForBaseName(sfBaseName: string): SourceFile {
    const sourceFile = this.sourceFilesMap.get(sfBaseName);

    if (!sourceFile) {
      throw new Error('isSourceFileInAPath Source file not found');
    }

    return sourceFile;
  }
}
