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
- Personal recipe categorization
- Lightweight ingredient sourcing information

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
/              → Custom frontend
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
- Personal notes
- Source URL
- Specialty ingredient indicators

### Lightweight Ingredient Sourcing

The application should support durable sourcing metadata for ingredients, such as:

- Preferred store
- Store section
- Availability notes
- Whether the ingredient is commonly stocked
- Whether the ingredient requires a specialty shopping trip

This is intentionally distinct from exact inventory management.

## Data Ownership

Tandoor should remain the source of truth for recipe-domain data.

Any application-specific metadata that does not fit naturally into Tandoor should be stored separately and keyed to Tandoor entity identifiers.

Examples include:

- Recipe effort rating
- “Would make again” status
- Personal notes
- Specialty shopping indicators
- Preferred ingredient source
- Store-specific notes

This separation avoids modifying Tandoor internals prematurely.

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
- Ingredient cross-reference pages
- Recipe filtering by specialty-store requirements
- Recipe filtering by effort level
- Recipe filtering by commonly stocked ingredients
- Household-specific annotations
- Optional integration with external inventory systems

## Architectural Decision Summary

Build a separate, API-driven frontend rather than forking Tandoor.

Use Tandoor as a headless recipe-management backend and retain the stock Tandoor interface as an administrative console.

Keep custom metadata separate unless a backend change becomes clearly necessary.

Do not implement exact pantry inventory unless the product direction later requires it.
