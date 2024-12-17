# Transition to Simplified Git Flow

- Status: superseded by [20241217-switch-back-to-github-flow](20241217-switch-back-to-github-flow.md)
- Date: 2024-09-26

## Context and Problem Statement

The existing GitHub Flow process lacked clarity for stable releases and was overly manual, making it hard to delegate and streamline contributions. The need was for a more structured yet simple workflow that would facilitate testing and contributions while automating releases.

Additional context in [Discussion #108: Does this project need a new maintainer?](https://github.com/thomvaill/log4brains/discussions/108)

## Decision Drivers

- Need for automation in releases.
- Be able to merge more quickly whithout breaking the stable branch, while making it possible for beta testers to test the new features.
- Easier delegation to new maintainers.
- Simplified yet structured process for contributors.
- Clearer separation between ongoing development and stable releases.

## Considered Options

- Continue with GitHub Flow.
- Transition to Simplified Git Flow.
- Full Git Flow with release branches.

## Decision Outcome

Chosen option: **Simplified Git Flow**, because it provides structure (separating development from stable releases) without excessive complexity. It also allows for automated canary/beta releases and easier delegation for merging feature branches to `develop`.

### Positive Consequences

- Clear separation of development (`develop`) and stable (`stable`) branches.
- Automated beta releases from `develop` to facilitate early testing.
- Allows contributors to participate in testing beta features and reduces the manual overhead of testing and releasing stable versions
- Easier to delegate responsibilities (Canary vs. Core Maintainers, see [CONTRIBUTING.md](CONTRIBUTING.md)).
- More streamlined versioning via Conventional Commits.

### Negative Consequences

- Contributors need to adjust to using `develop` for PRs instead of `stable`.
- Slight learning curve for Conventional Commits.

## Pros and Cons of the Options

### Continue with GitHub Flow

- Good, because it’s simpler with fewer branches.
- Bad, because it lacks separation of development and stable code.
- Bad, because manual testing and release increase bottlenecks.

### Simplified Git Flow

- Good, because it balances structure with simplicity.
- Good, because it allows easier delegation to maintainers.
- Bad, because it introduces a new `develop` branch, which may need adjustment for contributors.

### Full Git Flow

- Good, because it provides a full release management process.
- Bad, because it adds unnecessary complexity for smaller open-source projects.
