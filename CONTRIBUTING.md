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
npm uninstall -g log4brains
yarn install
yarn link-cli
yarn build

yarn dev
# ... if it does not work, you may have to add this line to your ~/.bashrc (or similar):
# export PATH="$PATH:$(yarn global bin)"

# You can now develop
# `yarn dev` re-builds the changed packages live

# You can test the different packages directly on the Log4brains project
log4brains adr new
log4brains preview
log4brains build
yarn serve-log4brains # serves the build output (`.log4brains/out`) locally

# For the Next.js app, you can enable the Fast Refresh feature just by setting NODE_ENV to `development`
NODE_ENV=development log4brains preview
# Or if you want to debug only the Next.js app without the Log4brains custom part, you can run:
cd packages/web && yarn next dev # (in this case `yarn dev` is not needed before running this command)

# To work on the UI, you probably would like to use the Storybook instead:
cd packages/web && yarn storybook

# To test the init CLI, create an empty project
cd $(mktemp -d -t l4b-test-XXXX)
log4brains init
```

When you are done, run `yarn unlink-cli && npm install -g log4brains` to use the official version again.

## Checks to run before pushing

```bash
yarn lint         # enforced automatically before every commit with husky+lint-staged
yarn format:fix   # enforced automatically before every commit with husky+lint-staged
yarn typescript   # enforced automatically before every commit with husky
yarn test:changed # (or `yarn test` to run all the tests)
```

Please do not forget to add tests to your contribution if this is applicable!

## License

By contributing to Log4brains, you agree that your contributions will be licensed under its Apache 2.0 License.
