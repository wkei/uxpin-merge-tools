import * as ts from 'typescript';
import { PropertyType } from '../../../../ComponentPropertyDefinition';
import { serializeEnumDeclaration } from './serializeEnumDeclaration';

export function serializeTypeDeclaration(declaration:ts.Declaration):PropertyType {
  switch (declaration.kind) {
    case ts.SyntaxKind.EnumDeclaration:
      return serializeEnumDeclaration(declaration as ts.EnumDeclaration);
    default:
      return { name: 'unsupported', structure: { raw: declaration.getText() } };
  }
}
