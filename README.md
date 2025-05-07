# trove

**trove** is an open source data exploration and observability tool designed for everyone at small, scrappy startups who need to pull, explore, and use data—PMs, EMs, marketing, partner success, and more. trove is focused on making data discovery and exploration easy, intuitive, and collaborative, without the complexity or per-seat pricing of traditional BI tools.

## MVP Features
- SQL Query Builder (inspired by Chartbrew, but focused purely on exploration)
- Schema and table discovery
- Query history and sharing
- Simple, modern UI for non-technical and technical users alike

## Vision
- Enable AI-powered data exploration and insights
- Integrate with dbt projects to enrich warehouse metadata
- Foster a collaborative, open data culture

## Getting Started

### Run the Full Stack with Docker Compose

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- PostgreSQL: [localhost:5432](localhost:5432)

See [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md) for more details.

## Database Seeding and dbt Integration

For development and testing, you can use the included dbt project to seed and build your database schema and sample data.

### Reset and Seed the Database

To drop all tables and reseed the database (dev/test only!):

```bash
make db-seed
```

This will:
- Drop and recreate the `public` schema in your Postgres database (deletes all tables/data!)
- Run `dbt deps` to install dbt dependencies
- Run `dbt seed` to load seed data (from `dbt_project/seeds`)
- Run `dbt run` to build dbt models

**Warning:** This will erase all data in the `public` schema. Use only for development/testing.

## License
This project is licensed under the Elastic License 2.0 (ELv2). See [LICENSE](LICENSE) for details.

---

*trove is in early development. Contributions and feedback are welcome!*
