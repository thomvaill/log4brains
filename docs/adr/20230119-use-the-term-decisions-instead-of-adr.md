# Use the term decisions instead of adr

- Status: accepted
- Deciders: Tyler Hubert, Thomas Vaillant, Joel Parker Henderson

Technical Story: https://github.com/thomvaill/log4brains/issues/12

## Context and Problem Statement

The idea behind documenting any decision that gets made is becoming more popular.  We should update the terminology in this library to reflect that any decision, not just architectural ones, should be documented and that this library can make that easier.

## Decision Drivers

- ADRs are starting to update their terminology to be Any Decision Records instead of Architectural, so using the more generic term decision is a simpler term that more people will understand.

## Considered Options

- Leave it as ADR
- Change the default folder to docs/decisions

## Decision Outcome

Chose to update the default folder to docs/decisions along with adding an alias to the `log4brains adr new` to be `log4brains decision new`.  This reflects the updated mindset that all decisions should be documented and not just architectural ones.

### Positive Consequences

- Hopefully more people will adopt this and document their decisions.  
