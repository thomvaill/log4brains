# CORE is responsible for enhancing ADR markdown body

- Status: accepted
- Date: 2020-10-26

## Context and Problem Statement

The markdown body of ADRs cannot be used as is, because:

- Links between ADRs have to be replaced with correct URLs
- Header (status, date, deciders etc...) has to be rendered with specific components

## Decision Drivers <!-- optional -->

- Potential future development of a vscode extension

## Considered Options

- Option 1: the UI is responsible
- Option 2: CORE is responsible

## Decision Outcome

Chosen option: "Option 2: CORE is responsible".
Because if we develop the vscode extension, it is better to add more business logic into the CORE package, and it is better tested.

### Positive Consequences <!-- optional -->

- The metadata in the header is simply removed

### Negative Consequences <!-- optional -->

- Each UI package will have to implement its own Header component
