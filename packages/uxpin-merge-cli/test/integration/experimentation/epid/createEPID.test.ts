import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { EPID } from '../../../../src/steps/experimentation/epid/EPID';
import { getEPIDFilePath } from '../../../../src/steps/experimentation/epid/getEPIDFilePath';
import { getProjectEPID } from '../../../../src/steps/experimentation/epid/getProjectEPID';
import { setTimeoutBeforeAll } from '../../../utils/command/setTimeoutBeforeAll';
import { setupExperimentationServerTest } from '../../../utils/experimentation/setupExperimentationServerTest';

const CURRENT_TIMEOUT:number = 30000;
setTimeoutBeforeAll(CURRENT_TIMEOUT);

describe('createEPID', () => {
  describe('when epid file doesn\'t exist', () => {
    const projectPath:string = resolve(__dirname, '../../../resources/designSystems/noSrcDir');
    let epidFilePath:string;

    const { getWorkingDir } = setupExperimentationServerTest({ projectPath, useTempDir: true });

    beforeEach(() => {
      epidFilePath = getEPIDFilePath(getWorkingDir());
    });

    it('should create epid file', () => {
      expect(existsSync(epidFilePath)).toBeTruthy();
    });

    it('should epid file has specific format', async () => {
      // given
      const expectedEPID:EPID = {
        revisionId: expect.stringMatching(/^[0-9a-f-]{36}_[0-9a-f]{40}/),
      };

      // when
      // then
      expect(await getProjectEPID(getWorkingDir())).toEqual(expectedEPID);
    });
  });

  describe('when epid file exists', () => {
    const projectPath:string = resolve(__dirname, '../../../resources/designSystems/withEpidFile');
    const { getWorkingDir } = setupExperimentationServerTest({ projectPath });

    it('should not override already existed epid file', () => {
      expect(getEpidContent(getWorkingDir())).toEqual(getEpidContent(projectPath));
    });

    function getEpidContent(projectDir:string):string {
      return readFileSync(getEPIDFilePath(projectDir)).toString('utf-8');
    }
  });
});
