/* We need our js file to be compiled and bundled by dts-cli.
   Therefore, we first create the files for the variables in
   the src folder, and then we run dts build to create the
   js files in the dist folder. */

import {
  baseFilePath,
  componentFilePath,
  dataFilePath,
  primitiveFilePath,
  semanticFilePath,
  transportFilePath,
} from './build-variables';
import { createColorSet, outputJSColorFile } from '../src/utils';

const createJSVariables = () => {
  const primitive = createColorSet(primitiveFilePath);
  const transport = createColorSet(transportFilePath);
  const semantic = createColorSet(semanticFilePath);
  const base = createColorSet(baseFilePath);
  const data = createColorSet(dataFilePath);
  const componentColors = createColorSet(componentFilePath);

  outputJSColorFile({ variables: primitive, name: 'primitive' });
  outputJSColorFile({ variables: semantic, name: 'semantic' });
  outputJSColorFile({ variables: base, name: 'base' });
  outputJSColorFile({ variables: data, name: 'data' });
  outputJSColorFile({ variables: transport, name: 'transport' });
  outputJSColorFile({ variables: componentColors, name: 'componentColors' });
};

createJSVariables();
