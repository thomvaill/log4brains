# Distribute Log4brains as a global NPM package

- Status: accepted
- Date: 2021-01-13

Technical Story: <https://github.com/thomvaill/log4brains/issues/14#issuecomment-750154907>

## Context and Problem Statement

Log4brains (`v1.0.0-beta.4`) installation procedure is currently optimized for JS projects and looks like this:

- Run `npx init-log4brains`
- Which installs locally `@log4brains/cli` and `@log4brains/web`
- And creates custom entries in `package.json`'s `scripts` section:
  - `"log4brains-preview": "log4brains-web preview"`
  - `"log4brains-build": "log4brains-web build"`
  - `"adr": "log4brains adr"`

For non-JS projects, you have to install manually the packages and the `npx init-log4brains` script does not work.

Since Log4brains is intended for all projects, not especially JS ones, we have to make the installation procedure simpler and language-agnostic.

## Decision Drivers <!-- optional -->

- Simplicity of the installation procedure
- Language agnostic
- Initialization script works on any kind of project
- Faster "getting started"

## Decision Outcome

The new installation procedure is now language agnostic and will be the following:

```bash
npm install -g log4brains
log4brains init
```

Log4brains will be distributed as a global NPM package named `log4brains`, which provides a global `log4brains` command.

- This global package will require the existing `@log4brains/cli` and `@log4brains/web` packages
- `init-log4brains` will be renamed to `@log4brains/init` and required as a dependency

### Consequences

For a JS project, it is now impossible to pin Log4brains to a specific version.
We may implement a [xojs/xo](https://github.com/xojs/xo)-like behavior later: "the CLI will use your local install of XO when available, even when run globally."

## Links

- [Related GitHub issue](https://github.com/thomvaill/log4brains/issues/14#issuecomment-750154907)
