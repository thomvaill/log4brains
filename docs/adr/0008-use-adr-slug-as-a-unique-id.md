# Use ADR slug as a unique ID

- Status: accepted

## Consequences

Sorting rules:

1. By Date field, in the markdown file (if present)
2. By Git creation date (does not follow renames)
3. By file creation date if no versioned yet
4. By slug

The core library is responsible for sorting.
