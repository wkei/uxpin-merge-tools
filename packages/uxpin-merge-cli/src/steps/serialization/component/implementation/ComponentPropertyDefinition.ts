export type ComponentPropertyDefinition = ComponentProperty & ComponentPropertyCustomDescriptors;

export interface ComponentProperty {
  defaultValue?:PropertyDefaultValue;
  description:string;
  isRequired:boolean;
  name:string;
  type?:PropertyType;
}

export interface ComponentPropertyCustomDescriptors {
  customDescription?:string;
  customName?:string;
  customType?:CustomControlType;
  hidden?:boolean;
}

export enum CustomDescriptorsTags {
  DESCRIPTION = '@uxpindescription',
  HIDDEN = '@uxpinignoreproperty',
  NAME = '@uxpinpropname',
  TYPE = '@uxpincontroltype',
}

export interface PropertyDefaultValue {
  value:any;
}

export interface PropertyType<T extends keyof PropertyTypeStructureMap = keyof PropertyTypeStructureMap> {
  name:T;
  structure:PropertyTypeStructureMap[T];
}

export type PropertyTypeName = keyof PropertyTypeStructureMap;

export interface PropertyTypeStructureMap {
  any:{};
  array:{};
  boolean:{};
  custom:{};
  element:{};
  func:FunctionStructure;
  literal:{ value:string|number };
  node:{};
  number:{};
  object:{};
  shape:ShapeTypeStructure;
  string:{};
  symbol:{};
  typedArray:TypedArrayStructure;
  dictionary:{ valueType:PropertyType };
  union:UnionTypeStructure;
  unsupported:{ raw:string; };
  empty:{};
}

export interface UnionTypeStructure {
  elements:PropertyType[];
}

export interface ShapeTypeStructure {
  [propName:string]:PropertyType;
}

export interface TypedArrayStructure {
  memberType:PropertyType;
}

export interface FunctionStructure {
  arguments?:FunctionArgumentStructure[];
  returnType?:PropertyType;
}

export interface FunctionArgumentStructure {
  name:string;
  type:PropertyType;
}

export interface CustomControlType<T extends CustomControlTypeName = CustomControlTypeName> {
  name:T;
  structure:CustomControlTypeStructureMap[T];
}

export enum CustomControlTypeName {
  CodeEditor = 'codeeditor',
  Input = 'input',
  Interactions = 'interactions',
  Number = 'number',
  Select = 'select',
  Switcher = 'switcher',
  Textfield = 'textfield',
}

export interface CustomControlTypeStructureMap {
  [CustomControlTypeName.CodeEditor]:{};
  [CustomControlTypeName.Input]:{};
  [CustomControlTypeName.Interactions]:{};
  [CustomControlTypeName.Number]:{};
  [CustomControlTypeName.Select]:{};
  [CustomControlTypeName.Switcher]:{};
  [CustomControlTypeName.Textfield]:{ rows?:number };
}
