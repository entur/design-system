/* We need our js file to be compiled and bundled by dts-cli.
   Therefore, we first create the files for the variables in
   the src folder, and then we run dts build to create the
   js files in the dist folder. */

import fs from 'fs-extra';
import path from 'path';
import { unflatten } from 'flat';
import * as prettier from 'prettier';

import {
  baseFilePath,
  componentFilePath,
  dataFilePath,
  primitiveFilePath,
  semanticFilePath,
  transportFilePath,
} from './build-variables';
import { WARNING_TEXT, createColorSet, variableSet } from './utils';

const createJSVariables = () => {
  const primitive = createColorSet(primitiveFilePath);
  const transport = createColorSet(transportFilePath);
  const semantic = createColorSet(semanticFilePath);
  const base = createColorSet(baseFilePath);
  const data = createColorSet(dataFilePath);
  const componentColors = createColorSet(componentFilePath);

  outputJSObjectFile(primitive, 'primitive');
  outputJSObjectFile(semantic, 'semantic');
  outputJSObjectFile(base, 'base');
  outputJSObjectFile(data, 'data');
  outputJSObjectFile(transport, 'transport');
  outputJSObjectFile(componentColors, 'componentColors');
};

function outputJSObjectFile(
  variables: variableSet[],
  name:
    | 'styles'
    | 'primitive'
    | 'semantic'
    | 'base'
    | 'data'
    | 'transport'
    | 'componentColors' = 'styles',
) {
  const jsVariables = variables.map(color => ({
    [color?.js.key]: color?.js.value,
  }));
  const jsVariablesObject = Object.assign({}, ...jsVariables);
  const unflattenedJSVariablesObject = unflatten(jsVariablesObject);

  const outputString = `${WARNING_TEXT}
 export const ${name} = ${JSON.stringify(unflattenedJSVariablesObject)}
 `;

  const formatedOutputString = prettier.format(outputString, {
    parser: 'babel',
  });

  fs.outputFileSync(
    path.resolve(__dirname, '../src', `${name}.ts`),
    formatedOutputString,
  );
}

createJSVariables();
