import { isArray } from 'lodash';
import { parse } from 'path';
import * as ts from 'typescript';
import { WarningDetails } from '../../../../../common/warning/WarningDetails';
import { ComponentImplementationInfo } from '../../../../discovery/component/ComponentInfo';
import { ComponentPropertyDefinition, PropertyType } from '../ComponentPropertyDefinition';
import { ImplSerializationResult } from '../ImplSerializationResult';

const REACT_COMPONENT_TYPES:string[] = [
  'React.Component',
  'React.PureComponent',
];

export async function serializeTSComponent(component:ComponentImplementationInfo):Promise<ImplSerializationResult> {
  const componentName:string = parse(component.path).name;

  const program:ts.Program = ts.createProgram([component.path], {
    module: ts.ModuleKind.ES2015,
    target: ts.ScriptTarget.ES2015,
  });
  const checker:ts.TypeChecker = program.getTypeChecker();
  const componentFile:ts.SourceFile | undefined = findComponentFile(program, component.path);
  if (!componentFile) {
    return getEmptySerializationResult(componentName, {
      message: 'TypeScript compiler couldn\'t find component file',
      sourcePath: component.path,
    });
  }
  const propsTypeNode:ts.TypeNode | undefined = getPropsType(componentFile, componentName);
  if (!propsTypeNode) {
    return getEmptySerializationResult(componentName);
  }
  const propsTypeSymbol:ts.Symbol = checker.getTypeFromTypeNode(propsTypeNode).symbol;
  if (!propsTypeSymbol || propsTypeSymbol.flags !== ts.SymbolFlags.Interface || !propsTypeSymbol.members) {
    return getEmptySerializationResult(componentName);
  }

  const serializedProps:ComponentPropertyDefinition[] = [];
  propsTypeSymbol.members.forEach((typeSymbol, propName) => {
    const propertyDefinition:ComponentPropertyDefinition | undefined =
      convertTypeSymbolToPropertyDefinition(typeSymbol, propName);
    if (propertyDefinition) {
      serializedProps.push(propertyDefinition);
    }
  });

  return {
    result: {
      name: componentName,
      properties: serializedProps,
    },
    warnings: [],
  };
}

function convertTypeSymbolToPropertyDefinition(
  typeSymbol:ts.Symbol,
  propName:ts.__String,
):ComponentPropertyDefinition | undefined {
  if (!ts.isPropertyDeclaration(typeSymbol.valueDeclaration) && !ts.isPropertySignature(typeSymbol.valueDeclaration)) {
    return;
  }
  const definition:ComponentPropertyDefinition = {
    description: getJSDocComment(typeSymbol.valueDeclaration as any),
    isRequired: isPropertyRequired(typeSymbol.valueDeclaration),
    name: propName.toString(),
  };
  if (typeSymbol.valueDeclaration.type) {
    definition.type = convertTypeNodeToPropertyType(typeSymbol.valueDeclaration.type);
  }
  return definition;
}

type TSProperty = ts.PropertySignature | ts.PropertyDeclaration;

function isPropertyRequired(declaration:TSProperty):boolean {
  return !declaration.questionToken;
}

interface JSDocCommentNode {
  kind:ts.SyntaxKind.JSDocComment;
  comment?:string;
}

function getJSDocComment(declaration:{ jsDoc?:JSDocCommentNode[] }):string {
  if (!isArray(declaration.jsDoc) || !declaration.jsDoc[0] || !declaration.jsDoc[0].comment) {
    return '';
  }
  return declaration.jsDoc[0].comment;
}

function convertTypeNodeToPropertyType(typeNode:ts.TypeNode):PropertyType {
  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { name: 'string', structure: {} };
    case ts.SyntaxKind.NumberKeyword:
      return { name: 'number', structure: {} };
    case ts.SyntaxKind.BooleanKeyword:
      return { name: 'boolean', structure: {} };
    default:
      return { name: 'unsupported', structure: { raw: typeNode.getText() } };
  }
}

function getEmptySerializationResult(componentName:string, warning?:WarningDetails):ImplSerializationResult {
  return {
    result: {
      name: componentName,
      properties: [],
    },
    warnings: warning ? [warning] : [],
  };
}

function getPropsType(
  sourceFile:ts.SourceFile,
  componentName:string,
):ts.TypeNode | undefined {
  const componentFunc:ts.FunctionDeclaration | undefined = findDefaultExportedFunction(sourceFile) ||
    findExportedFunctionWithName(sourceFile, componentName);
  if (componentFunc) {
    return getPropsTypeOfFunctionalComponent(componentFunc);
  }
  const componentClass:ClassComponentDeclaration | undefined = findDefaultExportedClass(sourceFile) ||
    findExportedClassWithName(sourceFile, componentName);
  if (componentClass) {
    return getPropsTypeOfClassComponent(componentClass);
  }
}

function findComponentFile(program:ts.Program, path:string):ts.SourceFile | undefined {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.fileName === path) {
      return sourceFile;
    }
  }
}

function getPropsTypeOfClassComponent(componentClass:ClassComponentDeclaration):ts.TypeNode | undefined {
  if (!componentClass.heritageClauses) {
    return;
  }
  return getPropsTypeNodeFromHeritageClauses(componentClass.heritageClauses);
}

function getPropsTypeNodeFromHeritageClauses(heritageClauses:ts.NodeArray<ts.HeritageClause>):ts.TypeNode | undefined {
  for (const clause of heritageClauses) {
    if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
      for (const type of clause.types) {
        if (ts.isExpressionWithTypeArguments(type)
          && REACT_COMPONENT_TYPES.includes(type.expression.getText())
          && type.typeArguments) {
          return type.typeArguments[0];
        }
      }
    }
  }
  return;
}

function getPropsTypeOfFunctionalComponent(func:ts.FunctionDeclaration):ts.TypeNode | undefined {
  if (!func.parameters || !func.parameters[0] || !func.parameters[0].type) {
    return;
  }
  return func.parameters[0].type;
}

function findDefaultExportedFunction(sourceFile:ts.SourceFile):ts.FunctionDeclaration | undefined {
  let result:ts.FunctionDeclaration | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node) && isDefaultExported(node)) {
      result = node;
    }
  });
  return result;
}

function findExportedFunctionWithName(
  sourceFile:ts.SourceFile,
  functionName:string,
):ts.FunctionDeclaration | undefined {
  let result:ts.FunctionDeclaration | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node) && isExported(node) && getNodeName(node) === functionName) {
      result = node;
    }
  });
  return result;
}

type ComponentDeclaration = ts.FunctionDeclaration | ClassComponentDeclaration;

type ClassComponentDeclaration = ts.ClassDeclaration | ts.ClassExpression;

function findDefaultExportedClass(sourceFile:ts.SourceFile):ClassComponentDeclaration | undefined {
  let result:ts.ClassDeclaration | ts.ClassExpression | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if ((ts.isClassDeclaration(node) || ts.isClassExpression(node)) && isDefaultExported(node)) {
      result = node;
    }
  });
  return result;
}

function findExportedClassWithName(sourceFile:ts.SourceFile, className:string):ClassComponentDeclaration | undefined {
  let result:ts.ClassDeclaration | ts.ClassExpression | undefined;
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isClassDeclaration(node) && isExported(node) && getNodeName(node) === className) {
      result = node;
    }
  });
  return result;
}

function isDefaultExported(node:ComponentDeclaration):boolean {
  if (!node.modifiers) {
    return false;
  }
  const isDefault:boolean = !!node.modifiers.find((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
  return isExported(node) && isDefault;
}

function isExported(node:ComponentDeclaration):boolean {
  if (!node.modifiers) {
    return false;
  }
  return !!node.modifiers.find((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function getNodeName(node:{ name?:ts.Identifier }):ts.__String | undefined {
  if (!node.name) {
    return;
  }
  return node.name.escapedText;
}
