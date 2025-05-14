[![CI](https://github.com/hr23232323/trove/actions/workflows/ci.yml/badge.svg)](https://github.com/hr23232323/trove/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/hr23232323/trove/releases)

# trove

**trove** is an open source data exploration and observability tool designed for everyone at small, scrappy startups who need to pull, explore, and use data—PMs, EMs, marketing, partner success, and more. trove is focused on making data discovery and exploration easy, intuitive, and collaborative, without the complexity or per-seat pricing of traditional BI tools.

## Demo

<video controls src="./assets/Trove-demo.mp4" title="Trove - demo"></video>

[![Watch the video](https://github.com/hr23232323/trove/blob/main/assets/thumbnail.png)](https://github.com/hr23232323/trove/blob/main/assets/Trove-demo.mp4)

## Existing Features

- DB explorer - Schema and table discovery
- SQL Editor - Query and explore data
- Simple, modern UI for non-technical and technical users alike

## Upcoming Features

- SQL Query Builder - Query without knowing SQL
- Query history and sharing
- AI-powered data exploration and insights
- Integrate with dbt projects to enrich warehouse metadata

## Getting Started

### Run the Full Stack with Docker Compose

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- Sample PostgreSQL DB: [localhost:5432](localhost:5432)

See [frontend/README.md](frontend/README.md), [backend/README.md](backend/README.md), [db/README.md](db/README.md) for more details on each service.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

A hosted version may be offered in the future, but the open source project is and will remain Apache 2.0 licensed.

---

_trove is in early development. Contributions and feedback are welcome!_
