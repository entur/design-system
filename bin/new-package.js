#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const toCase = require('case');

async function run() {
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

  const packageName = toCase.kebab(answers.packageName);

  // TODO: copy template folder
  console.log(`👉 Copying files into packages/${packageName}...`);
  fs.copySync(
    path.resolve('bin', 'template'),
    path.resolve('packages', packageName),
  );

  console.log(`💆‍♀️ Personalizing...`);
  // Update the package.json
  const newPackageJsonPath = path.resolve(
    'packages',
    packageName,
    'package.json',
  );
  let packageJson = fs
    .readFileSync(newPackageJsonPath, 'utf-8')
    .replace(/{package-name}/g, packageName);

  fs.writeFileSync(newPackageJsonPath, packageJson);

  // Update the src/index.tsx
  const indexTsxPath = path.resolve(
    'packages',
    packageName,
    'src',
    'index.tsx',
  );
  const indexTsxContent = fs
    .readFileSync(indexTsxPath, 'utf-8')
    .replace(/PackageName/g, toCase.pascal(packageName));

  fs.writeFileSync(indexTsxPath, indexTsxContent);

  // Adding the new workspace to the root package.json
  const rootPackageJsonPath = path.resolve('package.json');
  const rootPackageJson = await fs.readJson(rootPackageJsonPath);
  rootPackageJson.workspaces.push(`packages/${packageName}`);

  await fs.writeJson(rootPackageJsonPath, rootPackageJson, { spaces: 2 });

  console.log('✅ Package created!');
}

// We need to wrap our logic in a function so we can use `await` in our code.
// Top level await isn't yet available in node, but is coming!
// https://github.com/tc39/proposal-top-level-await
// For now - let's just run our app
run();
