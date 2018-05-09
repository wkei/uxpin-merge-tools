import { CommanderStatic } from 'commander';

export interface RawProgramArgs {
  args?:Arg[];
  cwd:string;
  dump:boolean;
  port?:number;
  summary:boolean;
  webpackConfig?:string;
  wrapper?:string;
  config?:string;
}

export type ProgramArgs = UploadProgramArgs | ServerProgramArgs;

interface UploadProgramArgs {
  command:'upload';
  cwd:string;
  dump:boolean;
  summary:boolean;
  webpackConfig?:string;
  wrapper?:string;
  config:string;
}

interface ServerProgramArgs {
  command:'server';
  cwd:string;
  port:number;
  webpackConfig?:string;
  wrapper?:string;
  config:string;
}

type Arg = string|CommanderStatic;
