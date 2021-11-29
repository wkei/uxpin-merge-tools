import * as cp from 'child_process';
import { printLine } from '../../../../utils/console/printLine';
import { PrintColor } from '../../../../utils/console/PrintOptions';
import { CreateAppProgramArgs } from '../../../args/ProgramArgs';
import { Step } from '../../Step';
import { APP_DIRECTORY } from './createAppDirectory';

export function installPackage(args:CreateAppProgramArgs):Step {
  return { exec: thunkInstallPackage(args), shouldRun: true };
}

export function thunkInstallPackage(args:CreateAppProgramArgs):() => Promise<void> {
  return async () => {
    if (!args.packageName) {
      throw new Error('Invalid package name');
    }

    const packageName:string = args.packageVersion ? `${args.packageName}@${args.packageVersion}` : args.packageName;

    const { status } = cp.spawnSync('npm', ['install', packageName], {
      cwd: APP_DIRECTORY,
    });

    if (status !== 0) {
      throw new Error('🛑 Something went wrong during installing package');
    }

    const { status: babelLoaderStatus } = cp.spawnSync(
      'npm', ['install', 'babel-loader', '@babel/core', '@babel/preset-env', '@babel/preset-react', 'webpack'], {
        cwd: APP_DIRECTORY,
      });

    if (babelLoaderStatus !== 0) {
      throw new Error('🛑 Something went wrong during installing babel-loader');
    }

    printLine(
      `✅ Packages "${args.packageName} babel-loader @babel/core @babel/preset-env webpack" installed`,
      { color: PrintColor.GREEN },
    );
  };
}
