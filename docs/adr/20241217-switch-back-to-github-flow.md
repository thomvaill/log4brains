# Switch back to GitHub Flow, but keeping the automated beta releases

- Status: accepted
- Date: 2024-12-17

## Context and Problem Statement

The previous decision to adopt a Simplified Git Flow with a `develop` and `stable` branch aimed to provide clearer separation between development and releases while enabling automated beta releases. However, we faced tooling limitations.

Specifically, **Lerna**, which we use for managing our monorepo, does not integrate well with Git Flow processes ([Lerna issue #2023](https://github.com/lerna/lerna/issues/2023#issuecomment-480402592)), when managing both a `develop` and `stable` branches: we cannot make Lerna publish a stable release from a different branch than the main one.

## Decision Drivers <!-- optional -->

- Make Lerna work again for stable releases
- Keep the benefits of the previous workflow:
  - Need for automation in releases.
  - Be able to merge more quickly whithout breaking the stable branch, while making it possible for beta testers to test the new features.
  - Easier delegation to new maintainers.
  - Simplified yet structured process for contributors.
  - Clearer separation between ongoing development and stable releases.

## Considered Options

- Option 1: Patch Lerna to keep the Simplified Git Flow (as described in the link above)
- Option 2: Switch back to Github Flow, but keeping the automated beta releases

## Decision Outcome

Chosen option: "Option 2: Switch back to Github Flow, but keeping the automated beta releases", because it fullfils all the requirements.
In fact, we can still merge quickly pull requests without releasing a stable release, while keeping the automated beta release.
The stable release is a manual script executed by maintainers.
