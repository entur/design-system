# Entur Design System Monorepo

This is the monorepo containing all packages in the Entur Design System, as well as the documentation site.

You'll find all the code in the `packages/` folder. The documentation site is found in the `packages/docs/` folder.

## Developing

To develop, please clone the project, and run `yarn` to install all dependencies.

To build all packages, run `yarn build`

To start a development server, run `yarn dev`

## Contributing

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) specification. This lets us create new version numbers and change logs based on commit messages, instead of spending time on doing it manually.

We have added a tool called `commitizen` that helps you with following this standard. Simply write `git commit`, and you'll be guided through a UI that creates nice commit messages that contain all the info we need.
