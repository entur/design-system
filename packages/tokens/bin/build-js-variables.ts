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
  semanticFilePath,
} from './build-variables';
import type { variableSet } from './build-variables';

const createJSVariables = () => {
  const primitive = createPrimitiveSet();
  const semantic = createVariablesSet(semanticFilePath);
  const base = createComponentColorSet(baseFilePath);
  const componentColors = createComponentColorSet();

  outputJSObjectFile(primitive, 'primitive');
  outputJSObjectFile(semantic, 'semantic');
  outputJSObjectFile(base, 'base');
  outputJSObjectFile(componentColors, 'componentColors');
};

function outputJSObjectFile(
  variables: variableSet[],
  name:
    | 'styles'
    | 'primitive'
    | 'semantic'
    | 'base'
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
