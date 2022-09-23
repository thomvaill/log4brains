# Use Markdown Architectural Decision Records

- Status: accepted
- Date: {DATE_YESTERDAY}
- Tags: doc

## Context and Problem Statement

We want to record architectural decisions made in this project.
Which format and structure should these records follow?

## Considered Options

- [MADR](https://adr.github.io/madr/) 2.1.2 with Log4brains patch
- [MADR](https://adr.github.io/madr/) 2.1.2 – The original Markdown Architectural Decision Records
- [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) – The first incarnation of the term "ADR"
- [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) – The Y-Statements
- Other templates listed at <https://github.com/joelparkerhenderson/architecture_decision_record>
- Formless – No conventions for file format and structure

## Decision Outcome

Chosen option: "MADR 2.1.2 with Log4brains patch", because

- Implicit assumptions should be made explicit.
  Design documentation is important to enable people understanding the decisions later on.
  See also [A rational design process: How and why to fake it](https://doi.org/10.1109/TSE.1986.6312940).
- The MADR format is lean and fits our development style.
- The MADR structure is comprehensible and facilitates usage & maintenance.
- The MADR project is vivid.
- Version 2.1.2 is the latest one available when starting to document ADRs.
- The Log4brains patch adds more features, like tags.

The "Log4brains patch" performs the following modifications to the original template:

- Change the ADR filenames format (`NNN-adr-name` becomes `YYYYMMDD-adr-name`), to avoid conflicts during Git merges.
- Add a `draft` status, to enable collaborative writing.
- Add a `Tags` field.

## Links

- Relates to [Use Log4brains to manage the ADRs]({LOG4BRAINS_ADR_SLUG}.md)
