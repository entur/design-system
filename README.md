# Entur Design System Monorepo

This is the monorepo containing all packages in the Entur Design System, as well as the documentation site.

You'll find all the code in the `packages/` folder. The documentation site is found in the `packages/docs/` folder.

## Developing

To develop, please clone the project, and run `yarn` to install all dependencies.

To build all packages, run `yarn build`

To start a development server, run `yarn start`

## Adding new packages

To create a new package, simply run `yarn new-package`, and you'll be guided through the process of creating a new package.

You can also specify the name of the new package if you want - like `yarn new-package swirler`.

Once this function is done, you'll want to visit the `packages/<your-new-package>/src` folder, and start implementing.

You will document the component via an MDX file in the `docs`-folder. This will also let you get some visual feedback while developing your component.

## Deploying the docs

The docs are currently available at [entur-design-system.firebaseapp.com](https://entur-design-system.firebaseapp.com).

### Setting up and logging in to Firebase

In order to deploy the docs locally, you need to have the `firebase-tools` CLI installed globally. You can do that by running `npm install -g firebase-tools` or `yarn global add firebase-tools`. Once installed, you need to log in with `firebase login`. Remember to use a user with access to the `entur-design-system` library. If you don't have access, please reach out to [Kristofer Giltvedt Selbekk](mailto:kristoffer.giltvedt.selbekk@entur.org) to be granted the correct access rights.

### The actual deploying part

To deploy the documentation website, run `yarn deploy-docs`. This will build the Gatsby site, and deploy it via the Firebase CLI.

## Contributing

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) specification. This lets us create new version numbers and change logs based on commit messages, instead of spending time on doing it manually.

We have added a tool called `commitizen` that helps you with following this standard. Simply write `git commit`, and you'll be guided through a UI that creates nice commit messages that contain all the info we need.
