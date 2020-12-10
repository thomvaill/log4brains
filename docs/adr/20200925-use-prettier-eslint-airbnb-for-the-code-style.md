# Use Prettier-ESLint Airbnb for the code style

- Status: accepted
- Date: 2020-09-25

## Context and Problem Statement

We have to choose our lint and format tools, and the code style to enforce as well.

## Considered Options

- Prettier only
- ESLint only
- ESLint with Airbnb code style
- ESLint with StandardJS code style
- ESLint with Google code style
- Prettier-ESLint with Airbnb code style
- Prettier-ESLint with StandardJS code style
- Prettier-ESLint with Google code style

## Decision Outcome

Chosen option: "Prettier-ESLint with Airbnb code style", because

- Airbnb code style is widely used (see [npm trends](https://www.npmtrends.com/eslint-config-airbnb-vs-eslint-config-google-vs-standard-vs-eslint-config-standard))
- Prettier-ESLint enforce some additional code style. We like it because the more opinionated the code style is, the less debates there will be :-)

In addition, we use also Prettier to format json and markdown files.

### Positive Consequences <!-- optional -->

- Developers are encouraged to use the [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) VSCode extensions while developing to auto-format the files on save
- And they are encouraged to use the [ESLint VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) as well to highlight linting issues while developing
