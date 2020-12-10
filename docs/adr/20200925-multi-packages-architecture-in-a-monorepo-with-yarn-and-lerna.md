# Multi-packages architecture in a monorepo with Yarn and Lerna

- Status: accepted
- Date: 2020-09-25

## Context and Problem Statement

We have to define the initial overall architecture of the project.
For now, we are sure that we want to provide these features:

- Local preview web UI
- Static Site Generation from the CI/CD
- CLI to create a new ADR quickly

In the future, we might want to provide these features:

- Create/edit ADRs from the local web UI
- VSCode extension to create and maybe edit an ADR from the IDE
- Support ADR aggregation from multiple repositories

## Considered Options

- Monolith
- Multi-packages, multirepo
- Multi-packages, monorepo
  - with NPM and scripts for links and publication
  - with Yarn and scripts for publication
  - with Yarn and Lerna

## Decision Outcome

Chosen option: "Multi-packages, monorepo, with Yarn and Lerna", because

- We don't want a monolith because we want the core library/API to be very well tested and probably developed with DDD and hexagonal architecture. The other packages will just call this core API, they will contain fewer business rules as possible. As we are not so sure about the features we will provide in the future, this is good for extensibility.
- Yarn + Lerna seems to be a very good practice used by a lot of other open-source projects to publish npm packages.

## Links <!-- optional -->

- [A Beginner's Guide to Lerna with Yarn Workspaces](https://medium.com/@jsilvax/a-workflow-guide-for-lerna-with-yarn-workspaces-60f97481149d)
- [Step by Step Guide to create a Typescript Monorepo with Yarn Workspaces and Lerna](https://blog.usejournal.com/step-by-step-guide-to-create-a-typescript-monorepo-with-yarn-workspaces-and-lerna-a8ed530ecd6d)
