import { Command } from '../../../src';
import { Environment } from '../../../src/program/env/Environment';
import { aruiFeatherSummaryStub } from '../../resources/stubs/aruiFeather';
import { runUXPinMergeCommand } from '../../utils/command/runUXPinMergeCommand';
import { setTimeoutBeforeAll } from '../../utils/command/setTimeoutBeforeAll';
import { getRandomPortNumber } from '../../utils/e2e/server/getRandomPortNumber';
import { startStubbyServer } from '../../utils/stubby/startStubbyServer';
import { stopStubbyServer } from '../../utils/stubby/stopStubbyServer';

const CURRENT_TIMEOUT:number = 30000;

setTimeoutBeforeAll(CURRENT_TIMEOUT);

describe('summary command integration', () => {
  let server:any;
  let tlsPort:number = getRandomPortNumber();

  beforeAll(async () => {
    server = await startStubbyServer({
      admin: getRandomPortNumber(),
      data: aruiFeatherSummaryStub.requests,
      stubs: getRandomPortNumber(),
      tls: tlsPort,
    });
  });

  afterAll(async () => {
    await stopStubbyServer(server);
  });

  describe('summary command prints ', () => {
    it('prints the list of components found in arui-feather example', () => {
      // when
      return runUXPinMergeCommand({
        cwd: 'resources/repos/arui-feather',
        env: {
          NODE_ENV: Environment.TEST,
          UXPIN_API_DOMAIN: `0.0.0.0:${tlsPort}`,
        },
        params: [
          Command.SUMMARY,
          '--config="../../configs/arui-feather-uxpin.config.js"',
        ],
      }).then((output) => {
        // then
        expect(output).toContain(
          `Uncategorized

    Amount
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Attach
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Button
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Calendar
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    CalendarInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    CardInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Checkbox
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    CheckboxGroup
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Collapse
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Dropdown
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    EmailInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    FlagIcon
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Form
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    FormField
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Heading
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Icon
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    IconButton
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Input
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    InputAutocomplete
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    InputGroup
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    IntlPhoneInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    IsolatedContainer
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Label
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Link
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    List
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    MaskedInput
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Menu
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    MenuItem
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    MoneyInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Mq
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Notification
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Paragraph
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    PhoneInput
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Plate
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Popup
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    PopupContainerProvider
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    PopupHeader
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘

    ProgressBar
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Radio
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    RadioGroup
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    RenderInContainer
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    ResizeSensor
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    Select
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Sidebar
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    SlideDown
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Spin
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Swipeable
        📜 documentation: ✘
        💡 examples: ✘
        🎛  presets: ✘

    TabItem
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Tabs
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    TagButton
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    Textarea
        📜 documentation: ✔
        💡 examples: ✔
        🎛  presets: ✘

    ThemeProvider
        📜 documentation: ✔
        💡 examples: ✘
        🎛  presets: ✘`);
      });
    });
  });
});
