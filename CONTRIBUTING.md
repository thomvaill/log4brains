# Contributing to Log4brains

:+1::tada: First of all, thanks for taking the time to contribute! :tada::+1:

All your contributions are very welcome, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

Thank you so much! :clap:

## Development

```bash
yarn install
yarn links
yarn dev

# You can now develop
# `yarn dev` re-builds the changed packages live

# You can test the different packages directly on the Log4brains project
# All its scripts are linked to your local dev version
yarn adr new
yarn log4brains-build
yarn serve # serves the build output (`.log4brains/out`) locally

# For the Next.js app, you can enable the Fast Refresh feature just by setting NODE_ENV to `development`
NODE_ENV=development yarn log4brains-preview
# Or you can run this more convenient command on the root project:
yarn log4brains-preview:dev
# Or if you want to debug only the Next.js app without the Log4brains custom part, you can run:
cd packages/web && yarn next dev # (in this case `yarn dev` is not needed before running this command)

# To work on the UI, you probably would like to use the Storybook instead:
cd packages/web && yarn storybook

# You can also test the different packages on an empty project
# `npx init-log4brains` is linked to your local dev version and will install
# the dev version of each Log4brains package if you set NODE_ENV to `development`
cd $(mktemp -d -t l4b-test-XXXX) && npm init --yes && npm install
NODE_ENV=development npx init-log4brains
```

## Checks to run before pushing

```bash
yarn lint         # enforced automatically before every commit with husky+lint-staged
yarn format:fix   # enforced automatically before every commit with husky+lint-staged
yarn test:changed # (or `yarn test` to run all the tests)
```

Please do not forget to add tests to your contribution if this is applicable!

## License

By contributing to Log4brains, you agree that your contributions will be licensed under its Apache 2.0 License.
