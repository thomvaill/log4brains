# Use Next.js for Static Site Generation

- Status: accepted
- Deciders: @Thomvaill
- Tags: frontend, frameworks

## Context and Problem Statement

Log4brains has two main features:

- `edit mode` which lets the developer edit the ADRs from a web UI, which is served locally by running `npm run log4brains`
  - The developer is also able to edit the markdown files directly from the IDE, which triggers a live-reload of the web UI
- `build mode` which generates a static site ready to deploy on a Github-pages-like service, so that the ADRs are easily browsable. Usually run by the CI with `npm run log4brains-build`

We need to find the best way to develop these two modes.

## Decision Drivers <!-- optional -->

- Maximize code reusability between the two modes (ie. do not have to develop everything twice)
- Time to Market:
  - @Thomvaill (first contributor) is a Node/React/PHP developer
  - @Thomvaill has 3 weeks available to develop and ship the first version of log4brains
- Balance between completeness/readyness of the chosen solution and future customization
  - This first version will have limited features for now but the chosen solution must be customizable enough to be able to implement the future features (ie. we can't choose a 100% opinionated and closed to modifications solution)

## Considered Options

- Option 1: MkDocs
- Option 2: Docsify
- Option 3: Docusaurus 2
- Option 4: Gatsby
- Option 5: Next.js

Other SSG like Nuxt or Hugo were not considered, because similar to Gatsby and Next.js in terms of features, but developed with other technologies than React.

## Decision Outcome

Chosen option: "Option 5: Next.js", because

- Markdown powered solutions are not enough customizable for our needs
- Gatsby and Next.js are quite similar, so it was hard to choose, but
  - Gatsby is more opinionated, because of GraphQL
  - I was influenced by this article: [Which To Choose in 2020: NextJS or Gatsby?](https://medium.com/frontend-digest/which-to-choose-in-2020-nextjs-vs-gatsby-1aa7ca279d8a)

### Positive Consequences <!-- optional -->

- We will use Typescript because Next.js supports it well

## Pros and Cons of the Options <!-- optional -->

### Option 1: MkDocs

<https://www.mkdocs.org/>

#### Pros

- Already powered by Markdown
- Very popular and actively maintained (10.8k stars on Github on 2020-09-22)
- Extendable with plugins and themes
- Live-reload already implemented

#### Cons

- `edit mode` can't be developed with a MkDoc plugin, so it has to be developed separately
- Some manual config in `mkdocs.yml` is required for the navigation and/or some [Front Matter](https://jekyllrb.com/docs/front-matter/) config in each markdown file
- Not 100% customizable, even with plugins
- Python

### Option 2: Docsify

<https://docsify.js.org/>

#### Pros

- Already powered by Markdown
- Very popular and actively maintained (15.1k stars on Github on 2020-09-22)
- Extendable with plugins and themes
- Live-reload already implemented
- No need to generate static pages (lib served over a CDN, which reads directly the markdown files from the repo) -> CI setup simplified

#### Cons

- `edit mode` has to be developed separately
- Some manual config in `_nav.yml` is required for the navigation
- Not 100% customizable, even with plugins
- No static pages generation (lib served over a CDN, which reads directly the markdown files from the repo) -> impossible to setup on private projects

### Option 3: Docusaurus 2

<https://v2.docusaurus.io/>

#### Pros

- Already powered by Markdown
- Possible to create React pages as well -> good for extensibility
- Very popular and actively maintained (19.1k stars on Github on 2020-09-22), even if the V2 is still in beta
- Live-reload already implemented

#### Cons

- No obvious way to develop the `edit mode` without some hacks
- Every markdown file require a [Front Matter](https://jekyllrb.com/docs/front-matter/) header

### Option 3: Docusaurus 2

<https://v2.docusaurus.io/>

#### Pros

- Already powered by Markdown
- Possible to create React pages as well -> good for extensibility
- Very popular and actively maintained (19.1k stars on Github on 2020-09-22), even if the V2 is still in beta
- Live-reload already implemented
- Typescript support

#### Cons

- No obvious way to develop the `edit mode` without some hacks to Docusaurus
- Every markdown file require a [Front Matter](https://jekyllrb.com/docs/front-matter/) header

### Option 4: Gatsby

<https://www.gatsbyjs.com/>

#### Pros

- Easily extensible SSG framework
- Very popular and actively maintained (47k stars on Github on 2020-09-22)
- `edit mode` can be developed on top of the `gatsby develop` command
- Typescript support

#### Cons

- Have to use GraphQL (opinionated framework)
- Need more development to parse markdown files than an already Markdown powered solution

### Option 5: Next.js

<https://nextjs.org/>

#### Pros

- Easily extensible, non-opinionated SSG framework
- Very popular and actively maintained (53.5k stars on Github on 2020-09-22)
- `edit mode` can be developed on top of the `npm run dev` command
- Typescript support

#### Cons

- Need more development to parse markdown files than an already Markdown powered solution

## Links <!-- optional -->

- [Curated list of Static Site Generators](https://www.staticgen.com/) used to compare them
- [Which To Choose in 2020: NextJS or Gatsby?](https://medium.com/frontend-digest/which-to-choose-in-2020-nextjs-vs-gatsby-1aa7ca279d8a)
