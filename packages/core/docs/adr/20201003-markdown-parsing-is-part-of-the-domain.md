# Markdown parsing is part of the domain

- Status: accepted
- Date: 2020-10-03

## Context and Problem Statement

Development of the core domain.

## Considered Options

- Markdown is part of the domain
- Markdown is a technical detail, which should be developed in the infrastructure layer

## Decision Outcome

Chosen option: "Markdown is part of the domain" because we want to be able to parse it "smartly", without forcing a specific structure.
Therefore, a lot of business logic is involved and should be tested.

### Positive Consequences

- Test coverage of the markdown parsing

### Negative Consequences

- The business logic is tightly tied to the markdown format. It won't be possible to switch to another format easily in the future
