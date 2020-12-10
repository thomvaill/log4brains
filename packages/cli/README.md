# @log4brains/cli

This package provides the CLI to use the [Log4brains](https://github.com/thomvaill/log4brains) architecture knowledge base in your project.

## Installation

You should use `npx init-log4brains` as described in the [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md), which will install all the required dependencies in your project, including this one, and set up the right scripts in your `package.json`.

You can also install this package manually via npm or yarn:

```bash
npm install --save-dev @log4brains/cli
```

or

```bash
yarn add --dev @log4brains/cli
```

And add this script to your `package.json`:

```json
{
  [...]
  "scripts": {
    [...]
    "adr": "log4brains adr"
  }
}
```

## Usage

See [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md), or run this command in your project:

```bash
npm run adr -- --help
```

or

```bash
yarn adr --help
```

## Documentation

- [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md)
