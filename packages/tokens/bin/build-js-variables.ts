/* We need our js file to be compiled and bundled by dts-cli.
   Therefore, we first create the files for the variables in 
   the src folder, and then we run dts build to create the
   js files in the dist folder. */

import fs from 'fs-extra';
import path from 'path';
import { unflatten } from 'flat';
import * as prettier from 'prettier';

import {
  WARNING_TEXT,
  baseFilePath,
  createComponentColorSet,
  createPrimitiveSet,
  createVariablesSet,
  dataFilePath,
  primitiveFilePath,
  semanticFilePath,
  transportFilePath,
} from './build-variables';
import type { variableSet } from './utils';

const createJSVariables = () => {
  const primitive = createPrimitiveSet(primitiveFilePath);
  const transport = createPrimitiveSet(transportFilePath);
  const semantic = createVariablesSet(semanticFilePath);
  const base = createComponentColorSet(baseFilePath);
  const data = createComponentColorSet(dataFilePath);
  const componentColors = createComponentColorSet();

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
  const jsVariables = variables.map(color => color?.js);
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
