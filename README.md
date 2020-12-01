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

⚡ **Demo**: Log4brains uses Log4brains to generate its [architecture knowledge base](https://thomvaill.github.io/log4brains/adr/).

### Features: <!-- omit in toc -->

- Docs-as-code chronological knowledge base from Architecture Decision Records (ADR)
- ADRs are written in markdown, stored in your git repository, close to your code
- Does not enforce a specific numbering for files (ie. `adr-0001.md`, `adr-0002.md`...) to avoid git merge issues
- Does not enforce a common structure, you are free to write however you want
  - Log4brains is able to create metadata for each ADR, just by parsing its text
  - Also guesses metadata from the git logs (last edit date, contributors...)
  - You can also provide a template of your choice (default: [MADR](https://adr.github.io/madr/))
- Local preview of the knowledge base
  - Hot Reload: any changes made in the markdown files are applied live
- Static site generation to automatically publish the knowledge base on a service like GitHub or GitLab Pages from your CI/CD pipeline
- Supports multi-packages projects (mono or multi repo): global and package-specific ADRs
- CLI to:
  - Create a new ADR interactively
  - Manage links between ADRs easily

**In a near future**:

- RSS feed / notifications for new ADRs
- Diagrams
- Decision backlog
- ADR reference annotation from the code: each ADR will display the code snippets that reference it
- ADR creation / edition from the knowledge base UI
- Create a new GitHub / GitLab issue from the knowledge base UI
- ... let's [create an issue](https://github.com/thomvaill/log4brains/issues/new/choose) if you have other needs!

## Table of contents <!-- omit in toc -->

- [🚀 Getting started](#-getting-started)
- [🤔 What is an ADR and why should you use them](#-what-is-an-adr-and-why-should-you-use-them)
- [📨 CI/CD configuration examples](#-cicd-configuration-examples)
  - [Publish to GitHub Pages with GitHub Actions](#publish-to-github-pages-with-github-actions)
  - [Publish to GitLab Pages with GitLab CI](#publish-to-gitlab-pages-with-gitlab-ci)
  - [Publish to S3](#publish-to-s3)
- [❓ FAQ](#-faq)
  - [What are the prerequisites?](#what-are-the-prerequisites)
  - [What about multi-packages projects?](#what-about-multi-packages-projects)
  - [What about non-JS projects?](#what-about-non-js-projects)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## 🚀 Getting started

According to the Log4brains philosophy, you should store your Architecture Decision Records (ADR) the closest to your code, which means ideally inside your project git repository, for example in `<your project>/docs/adr`. It is recommended to install Log4brains as a dev dependency of your project. To do so, go the root directory of your project and run our interactive setup CLI:

```bash
npx init-log4brains
```

... it will ask you several questions to get your knowledge base installed and configured properly.

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

Finally, do not forget to set up your CI/CD pipeline to automatically publish your knowledge base on a static website service like GitHub or GitLab Pages.

## 🤔 What is an ADR and why should you use them

The term ADR become popular in 2011 with Michael Nygard's article: [documenting architecture decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions). He aimed at reconciling Agile methods with software documentation by creating a very concise template
to record functional or non-functional "architecturally significant" decisions, in a lightweight format like markdown.
The original template had only a few parts:

- **Title**: Which sums up the solved problem and its solution
- **Context**: Probably the most important part, which describes "the forces at play, including technological, political, social, and project local"
- **Decision**
- **Status**: Proposed, accepted, deprecated, superseded...
- **Consequences**: The positive and negative ones for the future of the project

Today, there are other ADR templates like [Y-Statements](https://medium.com/olzzio/y-statements-10eb07b5a177), or [MADR](https://adr.github.io/madr/), which is the default one that is configured in Log4brains.
Anyway, be believe that there is no template that suits everyone's needs. You should adapt it according to your own situation.

As you can guess from the template above, an ADR is immutable. Only its status can change.
Thanks to this, your documentation is never out-of-date! Yes, an ADR can be deprecated or superseded by another one, but it was at least true one day!
And even if it's not the case anymore, it is still a precious piece of information.

This leads us to the main goals of this methodology:

- Avoid blind acceptance and blind reversal when you face past decisions
- Speed up the onboarding on new developers on a project
- Formalize a collaborative decision making process

The first goal was the very original one, intended by Michael Nygard in his article.
I discovered the two others in my past experiences with ADRs, and this is why I decided to create Log4brains.

To learn more on this topic, I recommend you to read these great resources:

- [Documenting architecture decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), by Michael Nygard
- [ADR GitHub organization](https://adr.github.io/), home of the [MADR](https://adr.github.io/madr/) template, by @boceckts and @koppor
- [Collection of ADR templates](https://github.com/joelparkerhenderson/architecture_decision_record) by @joelparkerhenderson

## 📨 CI/CD configuration examples

Log4brains lets you publish automatically your knowledge base on the static hosting service of your choice thanks to the `log4brains-web build` command.
Here are some configuration examples for the most common hosting services / CI runners.

### Publish to GitHub Pages with GitHub Actions

In this example, we will deploy Log4brains in a `log4brains` subfolder of your project GitHub page, accessible on `https://<username>.github.io/<repository>/log4brains/`.

First, create `.github/workflows/publish-log4brains.yml` and adapt it to your case:

```yml
name: Publish Log4brains
on:
  push:
    branches:
      - master
jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2.3.4
        with:
          persist-credentials: false # required by JamesIves/github-pages-deploy-action
          fetch-depth: 0 # required by Log4brains to work correctly (needs the whole Git history)
      - name: Install Node
        uses: actions/setup-node@v1
        with:
          node-version: "14"
      - name: Install and Build Log4brains (NPM)
        run: |
          npm ci
          npm run log4brains-build -- --basePath /${GITHUB_REPOSITORY#*/}/log4brains
      # - name: Install and Build Log4brains (Yarn)
      #   run: |
      #     yarn install --frozen-lockfile
      #     yarn log4brains-build --basePath /${GITHUB_REPOSITORY#*/}/log4brains
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@3.7.1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH: gh-pages
          FOLDER: .log4brains/out
          TARGET_FOLDER: log4brains
```

After the first run, this workflow will create a `gh-pages` branch in your repository containing the generated static files to serve.
Then, we have to tell GitHub that we [don't want to use Jekyll](https://github.com/vercel/next.js/issues/2029), otherwise, you will get a 404 error:

```bash
git checkout gh-pages
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll for Log4brains"
git push
```

Finally, you can [enable your GitHub page](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site):

- On GitHub, go to `Settings > GitHub Pages`
- Select the `gh-pages` branch as the "Source"
- Then, select the `/ (root)` folder

You should now be able to see your knowledge base at `https://<username>.github.io/<repository>/log4brains/`.
It will be re-built and published every time you push on `master`.

### Publish to GitLab Pages with GitLab CI

TODO

### Publish to S3

First, create a bucket with the "Static website hosting" feature enabled:

```bash
# This is an example, replace with the bucket name of your choice
export BUCKET_NAME=yourcompany-yourproject-log4brains

aws s3api create-bucket --acl public-read --bucket ${BUCKET_NAME}
read -r -d '' BUCKET_POLICY << EOP
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOP
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy "$BUCKET_POLICY"
aws s3 website s3://${BUCKET_NAME} --index-document index.html
```

Then, configure your CI to run these commands:

- Install Node and the AWS CLI
- Checkout your Git repository **with the full history**, otherwise, Log4brains won't work correctly (see examples above)
- `npm ci` or `yarn install --frozen-lockfile` to install the dev dependencies
- `npm run log4brains-build` or `yarn log4brains-build`
- `aws s3 sync .log4brains/out s3://<YOUR BUCKET> --delete`

Your knowledge base will be available on `http://<YOUR BUCKET>.s3-website-<YOUR REGION>.amazonaws.com/`.
You can get some inspiration on how to implement this workflow for GitHub Actions or GitLab CI by looking at the examples above.

## ❓ FAQ

### What are the prerequisites?

Just having Node.js >= v10.23 installed locally with either npm or yarn.

### What about multi-packages projects?

Log4brains supports both mono and multi packages projects. The `npx init-log4brains` command will prompt you regarding this.

In the case of a multi-packages project, you have two options:

- Multi-packages in a mono-repository: in this case, just install Log4brains in the root folder. It will manage "global ADRs", for example in `docs/adr` and "package-specific ADRs", for example in `packages/<package name>/docs/adr`.
- Multi-packages with one repository per package: in the future, Log4brains will be able to handle this case with a central repository for the "global ADRs", while fetching "package-specifics ADRs" directly from each package repository. For the moment, all the ADRs have to be stored in a central repository.

Here is an example of file structure for each case:

**Simple project:**

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

**Multi-packages project in a mono-repository:**

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

**Multi-packages with one repository per package:**

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

Pull Requests are more than welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Acknowledgments

- Michael Nygard for all his work on [Architecture Decision Records](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- @boceckts and @koppor for the [MADR](https://adr.github.io/madr/) template
- [Tippawan Sookruay](https://thenounproject.com/wanny4/) for the Log4brains logo
- @npryce, who inspired me for the CLI part with his [adr-tools](https://github.com/npryce/adr-tools) bash CLI
- @mrwilson, who inspired me for the static site generation part with his [adr-viewer](https://github.com/mrwilson/adr-viewer)

## License

This project is licensed under the Apache 2.0 license, Copyright (c) 2020 Thomas Vaillant. For more information see [LICENSE](LICENSE) file.
