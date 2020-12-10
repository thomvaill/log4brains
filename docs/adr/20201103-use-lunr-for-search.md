# Use Lunr for search

- Status: accepted
- Date: 2020-11-03

## Context and Problem Statement

We have to provide a search bar to perform full-text search on ADRs.

## Decision Drivers <!-- optional -->

- Works in preview mode AND in the statically built version
- Provides good fuzzy search and stemming capabilities
- Is fast enough to be able to show results while typing
- Does not consume too much CPU and RAM on the client-side, especially for the statically built version

## Considered Options

- Option 1: Fuse.js
- Option 2: Lunr.js

## Decision Outcome

Chosen option: "Option 2: Lunr.js".

## Pros and Cons of the Options <!-- optional -->

### Option 1: Fuse.js

<https://fusejs.io/>

- Fast indexing
- Slow searching
- Only fuzzy search, no stemming

### Option 2: Lunr.js

<https://lunrjs.com/>

- Slow indexing, but supports index serialization to pre-build them
- Fast searching
- Stemming, multi-language support
- Retrieves the position of the matched tokens

## Links

- <https://wiki.gpii.net/w/Technology_Evaluation_-_Static_Site_Search>
