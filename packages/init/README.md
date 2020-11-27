# @log4brains/init

This interactive CLI lets you install and configure the [Log4brains](https://github.com/thomvaill/log4brains) architecture knowledge base in your project.

## Usage

You should have a look at the main [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md) to get more context.

Start the interactive CLI by running this command in your project root directory:

```bash
npx @log4brains/init
```

It will:

- Install `@log4brains/cli` and `@log4brains/web` as development dependencies in your project (it detects automatically whether you use npm or yarn)
- Prompt you some questions in order to create the `.log4brains.yml` config file for you
- Import your existing Architecture Decision Records (ADR), or create a first one if you don't have any yet

## Documentation

- [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md)
