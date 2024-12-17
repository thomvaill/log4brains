# Contributing to Log4brains

:+1::tada: First of all, thanks for taking the time to contribute! :tada::+1:

All your contributions are very welcome, whether it’s a bug fix, new feature, or enhancement. Please follow the guidelines below to ensure a smooth contribution process.

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

## Coding standards

Ensure that your code follows our style guidelines and is fully tested. We use ESLint for code linting, and Prettier for code formatting.
See the section below for more details about the commands to run.

## Versioning and Commit Messages

We use Lerna with [Semantic Versioning](https://semver.org/). Version bumps are determined automatically by commit messages using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:

- `fix:` for patches
- `feat:` for new features
- `BREAKING CHANGE:` in the footer of the message for major changes

Example commit message:

```
feat: add a new command to generate specific ADRs
```

## Git workflow

Log4brains follows a **simplified Git Flow** model. Here’s how the process works:

1. **Fork the Repository**: First, fork the repository and clone it locally.
2. **Create a Feature Branch**: Create a new branch for your feature or bug fix based on the `develop` branch:
   ```bash
   git checkout develop
   git checkout -b my-new-feature
   ```
3. **Develop and Test**: Make your changes (do not forget the tests!), and ensure the following commands pass before submitting your PR:

   ```bash
   yarn lint         # enforced automatically before every commit with husky+lint-staged
   yarn format:fix   # enforced automatically before every commit with husky+lint-staged
   yarn typescript   # enforced automatically before every commit with husky
   yarn test:changed # (or `yarn test` to run all the tests)

   # Simulate the execution on a fresh install:
   yarn link-cli
   yarn build
   rm -rf node_modules
   yarn install --production --no-lockfile
   yarn e2e
   ```

   If applicable, a pull request without tests will be rejected.

4. **Rebasing**: Before creating your Pull Request, ensure it is rebased onto the latest develop to ensure that your changes can be merged without conflicts.

5. **Submit a Pull Request**: When your changes are ready, push your branch to your fork and open a Pull Request (PR) to the `develop` branch of the main repository.

   The PR will automatically trigger tests using GitHub Actions. If all tests pass, you can wait for a maintainer to review your PR.

6. **Review Process**: A maintainer will review your PR and provide feedback. If approved, your changes will be merged into `develop` (using "Squash and Merge" to maintain a clean history).

   It will then trigger automatically a **beta release** to npm, allowing users to install and test the latest changes:

   ```bash
   npm install log4brains@beta
   ```

   This helps us get feedback from early adopters before triggering a stable release.

7. **Stable Release**: Once the `develop` branch is stable and tested, the maintainers will manually run `scripts/release.sh` + `make -C docker release version-tag branch-tag latest-tag` to publish a new stable release to npm (TODO: should be automated in the future).

## License

By contributing to Log4brains, you agree that your contributions will be licensed under its Apache 2.0 License.

## Would like to become a co-maintainer?

As discussed in [discussion #108](https://github.com/thomvaill/log4brains/discussions/108), I (@thomvaill), as the project's sole maintainer, struggle to dedicate enough time to ensure its stability and growth, which is critical for its continued development. To ensure the project's long-term success, it is essential to have multiple maintainers. Therefore, I am actively seeking reliable and committed co-maintainers to share the responsibilities and contribute to the project's future.

To make it easier I introduce two co-maintainer roles:

- **Canary Maintainers**: in charge of triaging issues, reviewing PRs, and can merge them into `develop` (and thus trigger a beta release)
- **Core Maintainers**: in charge of the project's overall direction and vision, and of releasing stable versions

If you're interested in becoming a co-maintainer, you can start your "Mentorship Phase" by participating in code reviews and helping triage issues. This will help us assess your familiarity with the project and the workflow.

**Steps to becoming a co-maintainer**:

1. **Review Open PRs**: Begin by reviewing existing PRs and providing meaningful feedback. A current maintainer will mentor you through the review process.
2. **Help Triaging Issues**: Engage with users by helping resolve issues and providing guidance.
3. **Contribution Consistency**: Regular and meaningful contributions over time will demonstrate your knowledge and commitment.
4. **Reach Out** to <thomvaill@bluebricks.dev> to exress your interest in becomming a co-maintainer.

Once we identify a trusted contributor, we will elevate them to the **Canary Maintainer** status, with permissions to merge PRs and perform other tasks.
Later, a **Canary Maintainer** can become a **Core Maintainer** if they demonstrate a strong understanding of the project and its direction and if they are motived to take on the additional responsibilities.

## Issues triage

_Work in Progress_

- **Core Maintainers** are responsible for managing the [milestones](https://github.com/thomvaill/log4brains/milestones) of the project: this enables contributor to see what is planned for the next release, and what is the priority of the issues
- **Canary Maintainers** are responsible for triaging issues and PRs
