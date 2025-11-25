// @ts-ignore
export * from './generated-js-objects/primitive';
// @ts-ignore
export * from './generated-js-objects/semantic';
// @ts-ignore
export * from './generated-js-objects/base';
// @ts-ignore
export * from './generated-js-objects/data';
// @ts-ignore
export * from './generated-js-objects/transport';
// @ts-ignore
export * from './generated-js-objects/componentVariables';
// @ts-ignore Alias export for backwards compatibility
export { componentVariables as componentColors } from './generated-js-objects/componentVariables';
// @ts-ignore
export * from './legacy-tokens';

export {
  createVariableSet,
  createVariablesFileData,
  createJSColorFileData,
  // Legacy exports for backwards compatibility
  createColorSet,
  createColorsFileData,
} from './buildVariables';
