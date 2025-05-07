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

## License
This project is licensed under the Elastic License 2.0 (ELv2). See [LICENSE](LICENSE) for details.

---

*trove is in early development. Contributions and feedback are welcome!*
