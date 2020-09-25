# Avoid React.FC type

- Status: accepted
- Date: 2020-09-27
- Source: <https://github.com/spotify/backstage/blob/master/docs/architecture-decisions/adr006-avoid-react-fc.md> <!-- TODO: maybe a new feature? -->

## Context

Facebook has removed `React.FC` from their base template for a Typescript
project. The reason for this was that it was found to be an unnecessary feature
with next to no benefits in combination with a few downsides.

The main reasons were:

- **children props** were implicitly added
- **Generic Type** was not supported on children

Read more about the removal in
[this PR](https://github.com/facebook/create-react-app/pull/8177).

## Decision

To keep our codebase up to date, we have decided that `React.FC` and `React.SFC`
should be avoided in our codebase when adding new code.

Here is an example:

```typescript
/* Avoid this: */
type BadProps = { text: string };
const BadComponent: FC<BadProps> = ({ text, children }) => (
  <div>
    <div>{text}</div>
    {children}
  </div>
);

/* Do this instead: */
type GoodProps = { text: string; children?: React.ReactNode };
const GoodComponent = ({ text, children }: GoodProps) => (
  <div>
    <div>{text}</div>
    {children}
  </div>
);
```
