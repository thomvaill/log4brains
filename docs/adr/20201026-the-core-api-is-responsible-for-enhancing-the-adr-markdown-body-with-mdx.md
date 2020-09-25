# The core API is responsible for enhancing the ADR markdown body with MDX

- Status: accepted
- Date: 2020-10-26

## Context and Problem Statement

The markdown body of ADRs cannot be used as is, because:

- Links between ADRs have to be replaced with correct URLs
- Header (status, date, deciders etc...) has to be rendered with specific components

## Decision Drivers <!-- optional -->

- Potential future development of a VSCode extension

## Considered Options

- Option 1: the UI is responsible
- Option 2: the core API is responsible (with MDX)

## Decision Outcome

Chosen option: "Option 2: the core API is responsible (with MDX)".
Because if we develop the VSCode extension, it is better to add more business logic into the core package, and it is better tested.

### Positive Consequences <!-- optional -->

- The metadata in the header is simply removed

### Negative Consequences <!-- optional -->

- Each UI package will have to implement its own Header component
