import { Node, SyntaxKind } from 'ts-morph';

export function findDeepNode(node: Node, goalKind: SyntaxKind): Node | null {
  if (node.getKind() === goalKind) return node;
  if (node.getParent()) return findDeepNode(node.getParent()!, goalKind);

  return null;
}
