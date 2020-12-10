# Use Log4brains to manage the ADRs

- Status: accepted
- Date: {DATE_YESTERDAY}
- Tags: dev-tools, doc

## Context and Problem Statement

We want to record architectural decisions made in this project.
Which tool(s) should we use to manage these records?

## Considered Options

- [Log4brains](https://github.com/thomvaill/log4brains): architecture knowledge base (command-line + static site generator)
- [ADR Tools](https://github.com/npryce/adr-tools): command-line to create ADRs
- [ADR Tools Python](https://bitbucket.org/tinkerer_/adr-tools-python/src/master/): command-line to create ADRs
- [adr-viewer](https://github.com/mrwilson/adr-viewer): static site generator
- [adr-log](https://adr.github.io/adr-log/): command-line to create a TOC of ADRs

## Decision Outcome

Chosen option: "Log4brains", because it includes the features of all the other tools, and even more.
