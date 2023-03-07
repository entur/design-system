# Entur Design System Monorepo

This is the monorepo containing all packages in the Entur Design System, as well as the [documentation site](design.entur.no).

The repository consists of two main parts, the components and the documentation.
You'll find the code for all the components in the `packages/` folder. The documentation site is found in the `content/` folder.

## Requirements

- Node.JS 16.17.0
- yarn 1.22.19

You may use [Volta](https://docs.volta.sh/guide/) to manage your js command-line tools. Versions are pinned in `package.json` for seamless, per-project version [switching](https://docs.volta.sh/guide/understanding#managing-your-project).

## Developing

### First time setup

If it is your first time developing in the repository, please run `yarn setup`. It will install dependencies, and build all components.
Also, create the file `TestBench.tsx` in `src/components`. This file will be your testing ground for developing design system components.

#### Other commands

To build all packages _and_ the documentation, run `yarn build`

To start a development server for the documentation, run `yarn start`
PS: For first time setup, you will have to run `yarn build:packages` at least once for the development server to function (this is already handled if you ran `yarn setup`).

Run `yarn cleanStart` to clear the cache before starting the development server for the documentation.

### Developing components

In `packages/` you'll find all packages with their React-components. These components are accessible to other developers through [npm](https://www.npmjs.com/org/entur).

When developing components it is recommended to do so with the use of the aforementioned `TestBench.tsx`-file, which can be viewed with `yarn playroom`.
In addition to this, one has to run `yarn start` in the corresponding package where changes are made.

In short:

1. At root, run `yarn playroom`.
2. Make your changes in `packages/package-name`.
3. `cd packages/package-name` and run `yarn start` to watch for changes.

## Adding new packages

To create a new package, simply run `yarn new-package`, and you'll be guided through the process of creating a new package.

You can also specify the name of the new package if you want - like `yarn new-package swirler`.

Once this function is done, you'll want to visit the `packages/<your-new-package>/src` folder, and start implementing.

## Releasing packages

To release packages, first check that you're a part of the [Entur organization](https://www.npmjs.com/org/entur) on npm, and then you'll need to login to npm in your terminal (run `npm whoami` to see if you're logged in with the correct account).
You'll also have to activate two-factor authentication for authorization and publishing on your npm-account.

0. Be logged in to a appropriate npm-account
1. `git checkout master`
2. `git pull`
3. `yarn test && yarn lint` to make sure everything is good for release
4. `yarn lerna:publish`
5. Select `Y` when prompted, wait a couple of seconds as it hangs on "skipping releases", then press CTRL+C _once_. (See issue [here](https://github.com/lerna/lerna/issues/2664))
6. Wait

## Deploying the documentation

The docs are currently available at [design.entur.no](https://design.entur.no).

It is deployed automatically on the `master` branch via CircleCI.

## Contributing

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) specification. This lets us create new version numbers and changelogs based on commit messages, instead of spending time on doing it manually.

We have added a tool called `commitizen` that helps you with following this standard. Simply write `git commit`, and you'll be guided through a UI that creates nice commit messages that contain all the info we need. If that does not work, you may instead write `npx git-cz`

A more thorough explanation can also be found [here](https://design.entur.no/kom-i-gang/for-utviklere/bidra) (in norwegian only).
