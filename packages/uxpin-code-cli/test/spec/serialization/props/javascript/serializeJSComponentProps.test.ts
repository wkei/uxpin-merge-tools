import { WarningDetails } from '../../../../../src/common/warning/WarningDetails';
import { ComponentPropsList } from '../../../../../src/serialization/props/ComponentPropsList';
import { serializeJSComponentProps } from '../../../../../src/serialization/props/javascript/serializeJSComponentProps';
import { getJavaScriptComponentPath } from '../../../../utils/resources/getExampleComponentPath';

describe('serializeJSComponentProps', () => {
  describe('providing array of objects describing all properties of the JavaScript component', () => {
    it('serializes functional component with primitive property types', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('FunctionPrimitivesOnly');
      const expectedProps:ComponentPropsList = [
        {
          description: '',
          isRequired: false,
          name: 'children',
          type: { name: 'string', structure: {} },
        },
        {
          description: '',
          isRequired: true,
          name: 'id',
          type: { name: 'string', structure: {} },
        },
        {
          description: '',
          isRequired: false,
          name: 'action',
          type: { name: 'number', structure: {} },
        },
        {
          description: '',
          isRequired: false,
          name: 'hidden',
          type: { name: 'boolean', structure: {} },
        },
      ];

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings).toEqual([]);
      });
    });

    it('serializes class component with enum property types', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('ClassEnumTypes');
      const expectedProps:ComponentPropsList = [
        {
          description: '',
          isRequired: false,
          name: 'children',
          type: { name: 'node', structure: {} },
        },
        {
          description: '',
          isRequired: true,
          name: 'appearance',
          type: {
            name: 'union',
            structure: {
              elements: [
                { name: 'literal', structure: { value: 'secondary' } },
                { name: 'literal', structure: { value: 'primary' } },
                { name: 'literal', structure: { value: 'link' } },
              ],
            },
          },
        },
      ];

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings).toEqual([]);
      });
    });

    it('serializes class component with default property values', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('ClassWithDefaults');
      const expectedProps:ComponentPropsList = [
        {
          defaultValue: { value: 'Submit' },
          description: '',
          isRequired: false,
          name: 'value',
          type: { name: 'string', structure: {} },
        },
        {
          defaultValue: { value: 'secondary' },
          description: '',
          isRequired: true,
          name: 'appearance',
          type: {
            name: 'union',
            structure: {
              elements: [
                { name: 'literal', structure: { value: 'secondary' } },
                { name: 'literal', structure: { value: 'primary' } },
                { name: 'literal', structure: { value: 'link' } },
              ],
            },
          },
        },
      ];

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings).toEqual([]);
      });
    });

    it('serializes component with shape property type', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('ClassPropShapeType');
      const expectedProps:ComponentPropsList = [
        {
          description: '',
          isRequired: false,
          name: 'item',
          type: {
            name: 'shape',
            structure: {
              param1: { name: 'string', structure: {} },
              param2: { name: 'string', structure: {} },
              param3: {
                name: 'shape',
                structure: {
                  name: { name: 'string', structure: {} },
                },
              },
            },
          },
        },
      ];

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings).toEqual([]);
      });
    });

    it('serializes component with shape property type and a default value for it', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('PropShapeTypeWithDefault');
      const expectedProps:ComponentPropsList = [
        {
          defaultValue: {
            value: {
              param1: 'param1 default value',
              param3: { name: 'param3.name value' },
            },
          },
          description: '',
          isRequired: false,
          name: 'item',
          type: {
            name: 'shape',
            structure: {
              param1: { name: 'string', structure: {} },
              param2: { name: 'string', structure: {} },
              param3: {
                name: 'shape',
                structure: {
                  name: { name: 'string', structure: {} },
                },
              },
            },
          },
        },
      ];

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings).toEqual([]);
      });
    });

    it('provides warning details for corrupted default property values', () => {
      // given
      const componentPath:string = getJavaScriptComponentPath('CorruptedDefaultPropertyValue');
      const expectedProps:ComponentPropsList = [
        {
          description: '',
          isRequired: false,
          name: 'value',
          type: {
            name: 'string',
            structure: {},
          },
        },
      ];
      const expectedWarning:WarningDetails = {
        message: 'Cannot compute default value for property `value` of `CorruptedDefaultPropertyValue` component.',
        sourcePath: componentPath,
      };

      // when
      return serializeJSComponentProps(componentPath).then((serializedProps) => {
        // then
        expect(serializedProps.props).toEqual(expectedProps);
        expect(serializedProps.warnings[0].message).toEqual(expectedWarning.message);
        expect(serializedProps.warnings[0].sourcePath).toEqual(expectedWarning.sourcePath);
        expect(serializedProps.warnings[0].originalError).toBeInstanceOf(Error);
      });
    });
  });
});
