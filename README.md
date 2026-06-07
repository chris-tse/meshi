# Meshi

Meshi is a self-hosted recipe-library frontend for [Tandoor Recipes](https://tandoor.dev/).

The project is early-stage. The first implementation goal is a clean everyday recipe browser that treats Tandoor's REST API and OpenAPI schema as the authoritative data model.

## Development

This repository uses Bun workspaces.

```sh
bun install
bun run dev
```

The local web app lives in `apps/web`.
