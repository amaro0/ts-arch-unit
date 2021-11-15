import { ClassDeclaration, FunctionDeclaration, Project, SourceFile } from 'ts-morph';

interface IDiscoveredNode<T> {
  sourceFileBaseName: string;
  value: T;
}

export class ProjectMetaCrawler {
  private sourceFiles: SourceFile[];

  private classes: Map<string, IDiscoveredNode<ClassDeclaration[]>> = new Map();

  private classesArr: IDiscoveredNode<ClassDeclaration>[] = [];

  private functions: Map<string, IDiscoveredNode<FunctionDeclaration[]>> = new Map();

  private functionsArr: IDiscoveredNode<FunctionDeclaration>[] = [];

  private tsMorphProject: Project;

  constructor(root: string) {
    this.tsMorphProject = new Project();
    this.tsMorphProject.addSourceFilesAtPaths(`${root}/**/*{.d.ts,.ts,.js,.jsx,.tsx}`);

    this.sourceFiles = this.tsMorphProject.getSourceFiles();

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

  getClassByName(name: string): ClassDeclaration | undefined {
    return this.classesArr.find((c) => c.value.getName() === name)?.value;
  }
}
