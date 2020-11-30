# Use the ADR slug as its unique ID

- Status: accepted
- Date: 2020-10-16

## Context and Problem Statement

Currently, ADR files follow this format: `NNNN-adr-title.md`, with NNNN being an incremental number from `0000` to `9999`.
It causes an issue during a `git merge` when two developers have created a new ADR on their respective branch.
There is a conflict because [an ADR number must be unique](20200926-use-the-adr-number-as-its-unique-id.md).

## Decision

From now on, we won't use ADR numbers anymore.
An ADR will be uniquely identified by its slug (ie. its filename without the extension), and its filename will have the following format: `YYYYMMDD-adr-title.md`, with `YYYYMMDD` being the date of creation of the file.

As a result, there won't have conflicts anymore and the files will still be correctly sorted in the IDE thanks to the date.

Finally, the ADRs will be sorted with these rules (ordered by priority):

1. By Date field, in the markdown file (if present)
2. By Git creation date (does not follow renames)
3. By file creation date if no versioned yet
4. By slug

The core library is responsible for sorting.

## Links

- Supersedes [20200926-use-the-adr-number-as-its-unique-id](20200926-use-the-adr-number-as-its-unique-id.md)
