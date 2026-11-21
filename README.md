# pc-shop-patterns

Console app for ordering PC configurations (Server, Office PC, Gaming PC) with optional upgrades.
Course project demonstrating three design patterns in plain TypeScript:

- **Builder** - `ComputerBuilder` + `ConfigurationDirector` assemble the base configurations
- **Decorator** - `UpgradeDecorator` and four upgrades (extra RAM, better GPU, extra SSD, liquid cooling) stack on any computer
- **Facade** - `PcShopFacade` is the only class the console UI talks to

## Run

Requires Node.js 20+.

```bash
npm install
npm start        # console menu
npm test         # node:test
npm run build    # tsc -> dist/
```

Prices are whole EUR; performance is in points.

Full documentation (Bulgarian, with UML diagrams in Mermaid): [docs/documentation.md](docs/documentation.md)
