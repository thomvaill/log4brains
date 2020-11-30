# Use the ADR number as its unique ID

- Status: superseded by [20201016-use-the-adr-slug-as-its-unique-id](20201016-use-the-adr-slug-as-its-unique-id.md)
- Date: 2020-09-26

## Context and Problem Statement

We need to be able to identify uniquely an ADR, especially in these contexts:

- Web: to build its URL
- CLI: to identify an ADR in a command argument (example: "edit", or "preview")

## Considered Options

- ADR number (ie. filename prefixed number, example: `0001-use-markdown-architectural-decision-records.md`)
- ADR filename
- ADR title

## Decision Outcome

Chosen option: "ADR number", because

- It is possible to have duplicated titles
- The filename is too long to enter without autocompletion, but we could support it as a second possible identifier for the CLI in the future
- Other ADR tools like [adr-tools](https://github.com/npryce/adr-tools) already use the number as a unique ID
