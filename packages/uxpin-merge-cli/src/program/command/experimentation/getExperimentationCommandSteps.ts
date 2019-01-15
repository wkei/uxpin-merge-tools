import { ExperimentProgramArgs } from '../../args/ProgramArgs';
import { Step } from '../Step';
import { experimentationBuildLibraryStep } from './steps/experimentationBuildLibraryStep';
import { experimentationCreateEpidStep } from './steps/experimentationCreateEpidStep';
import { experimentationOpenBrowserStep } from './steps/experimentationOpenBrowserStep';
import { experimentationPrepareMetadataStep } from './steps/experimentationPrepareMetadataStep';
import { experimentationRunServerStep } from './steps/experimentationRunServerStep';
import { experimentationRunNgrok } from './steps/experimentationRunNgrok';

export function getExperimentationCommandSteps(args:ExperimentProgramArgs):Step[] {
  return [
    experimentationBuildLibraryStep(args),
    experimentationCreateEpidStep(args),
    experimentationPrepareMetadataStep(args),
    experimentationRunNgrok(args),
    experimentationRunServerStep(args),
    experimentationOpenBrowserStep(args),
  ];
}
