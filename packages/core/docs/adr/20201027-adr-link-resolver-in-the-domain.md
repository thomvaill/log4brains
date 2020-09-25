# ADR link resolver in the domain

- Status: accepted
- Date: 2020-10-27

## Context and Problem Statement

We have to translate markdown links between ADRs to static site links.
We cannot deduce the slug easily from the paths because of the "path / package" mapping, which is only known from the config.

## Considered Options

- Option 1: the ADR repository sets a Map on the ADR (`path -> slug`) for every link discovered in the Markdown
- Option 2: we introduce an "ADR link resolver" in the domain
- Option 3: we don't rely on link paths, but only on link labels (ie label must === slug)

## Decision Outcome

Chosen option: "Option 2: we introduce an "ADR link resolver" in the domain".
Because option 3 is too restrictive and option 1 seems too hacky.
And this solution is compatible with [20201003-markdown-parsing-is-part-of-the-domain](20201003-markdown-parsing-is-part-of-the-domain.md).
