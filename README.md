# Log4brains <!-- omit in toc -->

<p align="center">
  <a href="#">
    <img src="docs/Log4brains-logo-full.png" alt="Log4brains logo" width="276" height="349" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/thomvaill/log4brains/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202-blue" alt="License" />
  </a>
  <a href="https://github.com/thomvaill/log4brains/actions?query=workflow%3ABuild">
    <img src="https://github.com/thomvaill/log4brains/workflows/Build/badge.svg" alt="Build Status" />
  </a>
  <a href="https://github.com/thomvaill/log4brains/releases">
    <img src="https://img.shields.io/npm/v/@log4brains/web?label=%40log4brains%2Fweb" alt="@log4brains/web latest version" />
  </a>
  <a href="https://github.com/thomvaill/log4brains/releases">
    <img src="https://img.shields.io/npm/v/@log4brains/cli?label=%40log4brains%2Fcli" alt="@log4brains/cli latest version" />
  </a>
</p>

Log4brains is a 100% docs-as-code knowledge base for your development and infrastructure projects.
It enables you to write and manage [Architecture Decision Records](https://adr.github.io/) (ADR) right from your IDE, and to publish them automatically as a static website.

## Table of contents <!-- omit in toc -->

- [🚀 Getting started](#-getting-started)
  - [What about multi-packages projects?](#what-about-multi-packages-projects)
    - [Simple project](#simple-project)
    - [Multi-packages project in a mono-repository](#multi-packages-project-in-a-mono-repository)
    - [Multi-packages with one repository per package](#multi-packages-with-one-repository-per-package)
  - [What about non-JS projects?](#what-about-non-js-projects)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## 🚀 Getting started

According to the Log4brains philosophy, you should store your Architecture Decision Records (ADR) the closest to your code, which means ideally inside your project git repository, for example in `<your project>/docs/adr`.

It is recommended to install Log4brains as a development dependency of your project. To do so, go the root directory of your project and run our interactive setup CLI:

```bash
npx @log4brains/init
```

... it will ask you several questions to get your knowledge base installed and configured.

Then, you can start the web UI in local preview mode:

```bash
npm run log4brains-preview

# OR

yarn log4brains-preview
```

In this mode, the Hot Reload feature is enabled: any changes you make to the markdown files are applied live in the UI.

You can use this command to easily create a new ADR interactively:

```bash
npm run adr -- new

# OR

yarn adr new
```

Just add the `--help` option for more information on this command.

Finally, do not forget to set up your CI/CD pipeline to automatically publish your knowledge base on a static website service like GitHub or GitLab pages.

### What about multi-packages projects?

Log4brains supports both mono and multi packages projects. The `@log4brains/init` command will prompt you regarding this.

In the case of a multi-packages project, you have two options:

- Multi-packages in a mono-repository: in this case, just install Log4brains in the root folder. It will manage "global ADRs", for example in `docs/adr` and "package-specific ADRs", for example in `packages/<package name>/docs/adr`.
- Multi-packages with one repository per package: in the future, Log4brains will be able to handle this case with a central repository for the "global ADRs", while fetching "package-specifics ADRs" directly from each package repository. For the moment, all the ADRs have to be stored in a central repository.

Here is an example of file structure for each case:

#### Simple project

```
project
├── docs
|   └── adr
|       ├── 20200101-your-first-adr.md
|       ├── 20200115-your-second-adr.md
|       ├── [...]
|       └── template.md
[...]
```

#### Multi-packages project in a mono-repository

```
project
├── docs
|   └── adr
|       ├── 20200101-your-first-global-adr.md
|       ├── 20200115-your-second-global-adr.md
|       ├── [...]
|       └── template.md
├── packages
|   ├── package1
|   |   ├── docs
|   |   |   └── adr
|   |   |       ├── 20200102-your-first-package-specific-adr.md
|   |   |       ├── 20200116-your-second-package-specific-adr.md
|   |   |       [...]
|   |   [...]
|   ├── package2
|   |   ├── docs/adr [...]
|   |   [...]
|   [...]
[...]
```

#### Multi-packages with one repository per package

For the moment, the same as above, in a dedicated central repository.

### What about non-JS projects?

Even if Log4brains is developed in TypeScript and is part of the NPM ecosystem, it can be used for any kind of project, in any language.

For projects that do not have a `package.json` file, you have to install Log4brains globally:

```bash
npm install -g @log4brains-cli @log4brains-web
```

Create the `.log4brains.yml` config file manually in the root directory of your project. See [this example](https://github.com/Thomvaill/log4brains/blob/master/.log4brains.yml).

And use these global commands inside your project directory:

- Create a new ADR: `log4brains adr new`
- Start the local web UI: `log4brains-web preview`
- Build the static version: `log4brains-web build`

## Contributing

Lorem ipsum.

## Acknowledgments

- [Tippawan Sookruay](https://thenounproject.com/wanny4/) for the Log4brains logo

## License

This project is licensed under the Apache 2.0 license, Copyright (c) 2020 Thomas Vaillant. For more information see [LICENSE](LICENSE) file.
