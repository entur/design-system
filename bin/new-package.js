#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const toCase = require('case');
const { spawnSync } = require('child_process');

function sortByKey([prevKey], [nextKey]) {
  if (prevKey < nextKey) {
    return -1;
  }
  if (prevKey > nextKey) {
    return 1;
  }
  return 0;
}

async function run() {
  try {
    let packageName = process.argv[2];
    if (!packageName) {
      const answers = await inquirer.prompt([
        {
          name: 'packageName',
          message: 'What do you want to name your package?',
          validate: input => {
            const normalizedInput = `${input}`.toLowerCase().trim();
            const packageExists = fs.existsSync(
              path.resolve('packages', normalizedInput),
            );
            return packageExists
              ? `There's already a package with the name "${normalizedInput}".`
              : true;
          },
        },
      ]);
      packageName = answers.packageName;
    }

    packageName = toCase.kebab(answers.packageName);

    const paths = {
      templateFolder: path.resolve('bin', 'template'),
      newPackageFolder: path.resolve('packages', packageName),
      newPackageJson: path.resolve('packages', packageName, 'package.json'),
      newIndexTsx: path.resolve('packages', packageName, 'src', 'index.tsx'),
      rootPackageJson: path.resolve('package.json'),
      docsFolder: path.resolve('docs'),
      docsPackageJson: path.resolve('docs', 'package.json'),
    };

    console.log(`👉 Copying files into packages/${packageName}...`);
    fs.copySync(paths.templateFolder, paths.newPackageFolder);

    console.log(`💆‍♀️ Personalizing...`);
    // Update the package.json
    let packageJson = fs
      .readFileSync(paths.newPackageJson, 'utf-8')
      .replace(/{package-name}/g, packageName);

    fs.writeFileSync(paths.newPackageJson, packageJson);

    // Update the src/index.tsx
    const indexTsxContent = fs
      .readFileSync(paths.newIndexTsx, 'utf-8')
      .replace(/PackageName/g, toCase.pascal(packageName));

    fs.writeFileSync(paths.newIndexTsx, indexTsxContent);

    console.log('🦷 Adding package to the active workspaces');
    const rootPackageJson = await fs.readJson(paths.rootPackageJson);
    rootPackageJson.workspaces.push(`packages/${packageName}`);
    rootPackageJson.workspaces.sort();
    await fs.writeJson(paths.rootPackageJson, rootPackageJson, { spaces: 2 });

    console.log('📃 Adding package to the docs project');
    const docsPackageJson = await fs.readJson(paths.docsPackageJson);
    docsPackageJson.dependencies[`@entur/${packageName}`] = '^0.1.0';
    docsPackageJson.dependencies = Object.entries(docsPackageJson.dependencies)
      .sort(sortByKey)
      .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {});
    await fs.writeJson(paths.docsPackageJson, docsPackageJson, { spaces: 2 });

    console.log('📦 Installing packages in the docs project');
    spawnSync('yarn', ['install'], { cwd: paths.docsFolder });

    console.log('✅ Package created!');
    console.log(
      'Now, remember to document it thoroughly, and write some tests!',
    );
  } catch (e) {
    console.error('Something went wrong - exiting in a dirty state 🙀', e);
  }
}

// We need to wrap our logic in a function so we can use `await` in our code.
// Top level await isn't yet available in node, but is coming!
// https://github.com/tc39/proposal-top-level-await
// For now - let's just run our app
run();
