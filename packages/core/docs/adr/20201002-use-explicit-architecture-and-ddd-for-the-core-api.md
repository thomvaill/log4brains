# Use Explicit Architecture and DDD for the core API

- Status: accepted
- Date: 2020-10-02

As mentioned in [20200925-multi-packages-architecture-in-a-monorepo-with-yarn-and-lerna](../../../../docs/adr/20200925-multi-packages-architecture-in-a-monorepo-with-yarn-and-lerna.md), we want the core API to be well-tested because all the business logic will happen here.

Herberto Graça did an awesome job but by putting together all the best practices of DDD, hexagonal architecture, onion architecture, clean architecture, CQRS... in what he calls [Explicit Architecture](https://herbertograca.com/tag/explicit-architecture/).
We will use this architecture for our core package.
