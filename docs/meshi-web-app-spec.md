# Recipe Library Frontend — High-Level Technical Specification

## Overview

Build a self-hosted, opinionated recipe-library frontend that uses Tandoor Recipes as its backend system of record.

The application should provide a cleaner and more focused experience for browsing, searching, and reviewing a personal collection of recipes. It should prioritize recipes that have already been made and are practical to cook again, rather than exposing the full complexity of a general-purpose recipe-management platform.

## Goals

- Provide a polished, mobile-friendly interface for browsing a personal recipe collection.
- Support fast recipe search and simple tag-based filtering.
- Display concise recipe details without the preamble and clutter of external recipe websites.
- Reuse Tandoor’s existing recipe import, storage, authentication, and metadata capabilities.
- Allow the stock Tandoor interface to remain available for advanced management tasks.
- Keep the custom frontend independently deployable and distributable.

## Non-Goals

- Reimplement the Tandoor backend.
- Replace Tandoor’s database schema.
- Maintain exact household pantry inventory.
- Require users to record ingredient consumption after each meal.
- Recreate every feature exposed by the stock Tandoor interface.
- Couple the custom frontend directly to Tandoor’s database.

## System Architecture

The system should be composed of two independently deployable applications:

```text
Custom Recipe Frontend
        ↓
Tandoor REST API
        ↓
Tandoor Backend
        ↓
PostgreSQL
```

Tandoor remains the backend system of record. The custom frontend communicates with Tandoor exclusively through its REST API and OpenAPI schema.

The stock Tandoor web interface should remain accessible as a secondary administrative interface.

## Application Responsibilities

### Custom Frontend

The custom frontend is the primary user-facing experience for everyday usage.

It should provide:

- Recipe browsing
- Recipe search
- Tag-based filtering
- Recipe detail views
- Ingredient lists
- Instructions
- Serving-size adjustments
- Recipe source links
- Recipe categorization based on Tandoor metadata

### Tandoor Backend

Tandoor remains responsible for:

- Recipe persistence
- Recipe imports from external URLs
- Authentication
- User and household management
- Recipe metadata
- Tags and keywords
- Ingredient normalization
- Media storage
- Shopping-list functionality
- Advanced administrative workflows

### Stock Tandoor Interface

The existing Tandoor interface remains available for workflows that are not initially implemented in the custom frontend, including:

- Importing recipes
- Correcting import results
- Managing tags
- Managing ingredients
- Configuring stores and supermarket categories
- Merging duplicate ingredients
- User management
- Advanced shopping-list workflows
- Administrative settings

## Deployment Model

The custom frontend should be distributed as a separate container.

The Meshi container should run the Bun server layer in production. The React/Vite app is a build-time artifact: Vite produces static browser assets, and the Bun server serves those built files while also proxying Tandoor API and media requests. Vite should not run as a production service.

Two deployment modes should be supported.

### Existing Tandoor Instance

Users who already run Tandoor can add the custom frontend as an additional container and point it at their existing Tandoor deployment.

### Turnkey Deployment

New users can deploy a bundled Compose stack containing:

- Custom frontend
- Tandoor backend
- PostgreSQL database
- Reverse proxy, if required

The Tandoor backend should remain an upstream dependency rather than vendored source code.

## Routing

The recommended deployment exposes the custom frontend and Tandoor backend through a shared origin.

```text
/              → Meshi React app served by the Bun server
/api/*         → Tandoor API
/media/*       → Tandoor media
```

The stock Tandoor interface may be exposed through a secondary hostname or route.

```text
recipes.example.com          → Custom frontend
tandoor-admin.example.com    → Stock Tandoor interface
```

## API Integration

The frontend should use Tandoor’s OpenAPI schema as the contract for backend communication.

The OpenAPI schema should be treated as the source of truth for:

- Available endpoints
- Request types
- Response types
- Authentication behavior
- Compatibility checks

The frontend should remain API-driven and must not access the Tandoor database directly.

## Initial Product Scope

The initial product should stay tightly aligned with Tandoor's existing data model. Tandoor's REST API and OpenAPI schema are the authoritative contract for the first implementation phase. The frontend should avoid introducing a separate application database or sidecar metadata store until a concrete product need justifies it.

### Recipe Library

The main page should provide:

- Search
- Tag filters
- Recipe cards
- Recipe images
- Quick access to frequently used recipes
- Simple browsing by category

### Recipe Detail View

Each recipe page should provide:

- Recipe title
- Image
- Ingredients
- Instructions
- Serving-size adjustment
- Tags
- Notes already available through Tandoor, if present
- Source URL
- Recipe metadata already available through Tandoor

### Lightweight Ingredient Sourcing

Durable ingredient sourcing metadata is deferred beyond the initial product scope. The first implementation should not introduce a separate store for:

- Preferred store
- Store section
- Availability notes
- Whether the ingredient is commonly stocked
- Whether the ingredient requires a specialty shopping trip

If Tandoor already exposes useful ingredient, food, keyword, supermarket-category, or shopping-list data through its API, the frontend may display that data. It should not create a parallel sourcing model yet. This remains intentionally distinct from exact inventory management.

## Data Ownership

Tandoor should remain the source of truth for recipe-domain data.

For the initial implementation, Meshi should treat Tandoor's API schema as the application's data schema. Recipe fields, ingredients, steps, tags, media, notes, source links, and authentication behavior should be modeled from the OpenAPI contract rather than from a Meshi-owned persistence layer.

Application-specific metadata that does not fit naturally into Tandoor should be deferred until a later phase. If that need becomes concrete, the metadata can be stored separately and keyed to Tandoor entity identifiers.

Examples include:

- Recipe effort rating
- “Would make again” status
- Personal notes
- Specialty shopping indicators
- Preferred ingredient source
- Store-specific notes

This deferral keeps the first version focused on being a better everyday Tandoor reader/browser. It also avoids creating a second recipe system before the product proves which additional metadata is actually worth owning.

## Compatibility Strategy

The custom frontend should declare compatibility with specific Tandoor versions.

Turnkey deployments should pin a tested Tandoor version rather than automatically tracking the latest release.

Compatibility should be validated when:

- Tandoor changes its OpenAPI schema
- Tandoor changes authentication behavior
- Tandoor changes media routing
- Tandoor changes recipe-related API contracts

## Distribution Strategy

The frontend should be distributed as an independent open-source project.

The project should:

- Avoid bundling modified Tandoor source code
- Avoid replacing Tandoor’s static assets in-place
- Avoid depending on internal frontend implementation details
- Treat Tandoor as an external backend dependency
- Document supported Tandoor versions
- Provide an example Compose configuration

## Future Scope

Potential future enhancements include:

- Recipe import directly from the custom frontend
- Lightweight recipe editing
- Shopping-list generation
- Sidecar metadata for recipe ratings, repeat-cook status, and sourcing notes
- Ingredient cross-reference pages
- Recipe filtering by specialty-store requirements
- Recipe filtering by effort level
- Recipe filtering by commonly stocked ingredients
- Household-specific annotations
- Optional integration with external inventory systems

## Architectural Decision Summary

Build a separate, API-driven frontend rather than forking Tandoor.

Use Tandoor as a headless recipe-management backend and retain the stock Tandoor interface as an administrative console.

Defer custom metadata storage until a later phase; use Tandoor's API schema as the authoritative initial data model.

Do not implement exact pantry inventory unless the product direction later requires it.
