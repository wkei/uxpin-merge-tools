import { Command } from '../../../src';
import { Environment } from '../../../src/program/env/Environment';
import { TEMP_DIR_NAME } from '../../../src/steps/building/config/getConfig';
import { emptyLatestCommitStub } from '../../resources/stubs/emptyLatestCommit';
import { runCommand } from '../../utils/command/runCommand';
import { runUXPinMergeCommand } from '../../utils/command/runUXPinMergeCommand';
import { setTimeoutBeforeAll } from '../../utils/command/setTimeoutBeforeAll';
import { getRandomPortNumber } from '../../utils/e2e/server/getRandomPortNumber';
import { ADMIN_PORT_RANGE, startStubbyServer, STUBS_PORT_RANGE, TLS_PORT_RANGE } from '../../utils/stubby/startStubbyServer';
import { stopStubbyServer } from '../../utils/stubby/stopStubbyServer';

const CURRENT_TIMEOUT:number = 60000;

setTimeoutBeforeAll(CURRENT_TIMEOUT);

describe('Building designSystems/cantWriteToUxpinTemp design system', () => {
  const DEFAULT_PERMISSIONS:string = '755';
  const READONLY_PERMISSIONS:string = '444';
  const workingDir:string = 'resources/designSystems/cantWriteToUxpinTemp';
  const uxpinTempPath:string = `test/${workingDir}/${TEMP_DIR_NAME}`;
  let server:any;
  const tlsPort:number = getRandomPortNumber(TLS_PORT_RANGE.min, TLS_PORT_RANGE.max);

  beforeAll(async () => {
    server = await startStubbyServer({
      admin: getRandomPortNumber(ADMIN_PORT_RANGE.min, ADMIN_PORT_RANGE.max),
      data: emptyLatestCommitStub.requests,
      stubs: getRandomPortNumber(STUBS_PORT_RANGE.min, STUBS_PORT_RANGE.max),
      tls: tlsPort,
    });
  });

  afterAll(async () => {
    await stopStubbyServer(server);
  });

  const chmod:(path:string, mode:string) => Promise<string> = (path, mode) => runCommand(`chmod ${mode} ${path}`);

  afterEach(() => {
    return chmod(uxpinTempPath, DEFAULT_PERMISSIONS);
  });

  it('shows permission denied Error when can not write to temporary directory', async () => {
    await chmod(uxpinTempPath, READONLY_PERMISSIONS);
    await expect(runUXPinMergeCommand({
      cwd: workingDir,
      env: {
        UXPIN_API_DOMAIN: `0.0.0.0:${tlsPort}`,
        UXPIN_ENV: Environment.TEST,
      },
      params: [
        Command.PUSH,
      ],
    }))
      .rejects.toMatch('EACCES: permission denied');
  });
});
