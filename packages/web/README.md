# @log4brains/web

This package provides the web UI of the [Log4brains](https://github.com/thomvaill/log4brains) architecture knowledge base and its static site generation capabilities.

## Installation

You should use `npx init-log4brains` as described in the [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md), which will install all the required dependencies in your project, including this one, and set up the right scripts in your `package.json`.

You can also install this package manually via npm or yarn:

```bash
npm install --save-dev @log4brains/web
```

or

```bash
yarn add --dev @log4brains/web
```

And add these scripts to your `package.json`:

```json
{
  [...]
  "scripts": {
    [...]
    "log4brains-preview": "log4brains-web preview",
    "log4brains-build": "log4brains-web build",
  }
}
```

## Usage

You should have a look at the main [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md) to get more context.

### Preview

This command will start the web UI in preview mode locally on <http://localhost:4004/>.
You can define another port with the `-p` option.
In this mode, the Hot Reload feature is enabled: any changes you make to the markdown files are applied live in the UI.

```bash
npm run log4brains-preview
```

or

```bash
yarn log4brains-preview
```

### Build

This command should be used in your CI/CD pipeline. It creates a static version of your knowledge base, ready to be deployed
on a static website hosting service like GitHub or GitLab pages.

```bash
npm run log4brains-build
```

or

```bash
yarn log4brains-build
```

The default output directory is `.log4brains/out`. You can change it with the `-o` option.

## Documentation

- [Log4brains README](https://github.com/thomvaill/log4brains/blob/master/README.md)
