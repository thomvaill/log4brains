# Architecture Decision Records

## Definition

> An Architectural Decision (AD) is a software design choice that addresses a functional or non-functional requirement that is architecturally significant.
> An Architectural Decision Record (ADR) captures a single AD, such as often done when writing personal notes or meeting minutes; the collection of ADRs created and maintained in a project constitutes its decision log.

An ADR is immutable, only its status can change (ie. it can become deprecated or superseded). That way, you can get an idea of the whole project history just by reading its decision log in chronological order.

To get more information:

- [ADR GitHub organization](https://adr.github.io/)
- [What is an ADR and why should you use them](https://github.com/thomvaill/log4brains/tree/master#-what-is-an-adr-and-why-should-you-use-them)

## Location

ADRs are automatically published with Log4brains at <https://thomvaill.github.io/log4brains/adr/>.

## Development

To preview them locally, run:

```bash
npm run log4brains-preview
# OR
yarn log4brains-preview
```

To create a new ADR interactively, run:

```bash
npm run adr new
# OR
yarn adr new
```

For more information, please have a look at the [Log4brains documentation](https://github.com/thomvaill/log4brains/tree/master#readme).
