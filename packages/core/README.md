# @log4brains/core

This package provides the core API of the [Log4brains](https://github.com/thomvaill/log4brains) architecture knowledge base.
It is not meant to be used directly.

Install [the main log4brains package](https://www.npmjs.com/package/log4brains) instead:

```bash
npm install -g log4brains
```

## Installation

This package is not meant to be installed directly in your project.

However, if you want to create a package that uses [Log4brains](https://github.com/thomvaill/log4brains)' API,
you can include this package as a dependency:

```bash
npm install --save @log4brains/core
```

or

```bash
yarn add @log4brains/core
```

## Usage

```typescript
import { Log4brains } from "@log4brains/core";

const l4b = Log4brains.createFromCwd(process.cwd());

// See the TypeDoc documentation (TODO: to deploy on GitHub pages) to see available API methods
```

## Documentation

- TypeDoc documentation (TODO)
- [Log4brains README](https://github.com/thomvaill/log4brains/blob/develop/README.md)
