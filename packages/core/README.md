# @log4brains/core

This package provides the core API of the [Log4brains](https://github.com/thomvaill/log4brains) architecture knowledge base.
It is not meant to be used directly in your project.

## Installation

This package is not meant to be installed directly in your project. This is a common dependency of [@log4brains/cli](https://www.npmjs.com/package/@log4brains/cli) and [@log4brains/web](https://www.npmjs.com/package/@log4brains/web), which is installed automatically.

However, if you want to create a package to extend [Log4brains](https://github.com/thomvaill/log4brains)' capabilities,
you can include this package as a dependency of yours via npm or yarn:

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

const l4b = Log4brains.create(process.cwd());

// See the TypeDoc documentation (TODO: to deploy on GitHub pages) to see available API methods
```

## Documentation

- TypeDoc documentation (TODO)
- [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md)
