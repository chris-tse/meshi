# Meshi CLI — Technical Specification

## Overview

The `meshi` npm package provides a command-line interface for Meshi, a self-hosted recipe-library frontend built on top of Tandoor Recipes.

The initial purpose of the package is to establish a legitimate, functional npm artifact for the `meshi` namespace while keeping the implementation intentionally small. The first release should not attempt to manage a complete Meshi deployment before the application architecture is finalized.

Over time, the CLI may grow into an optional lifecycle-management tool for self-hosted Meshi installations.

## Goals

### Initial Release

- Publish a real, functional npm package under the `meshi` name.
- Provide a working `meshi` executable.
- Support standard CLI discovery commands.
- Provide a minimal initialization command that creates a useful starter artifact.
- Avoid implying that the complete Meshi deployment workflow is already finalized.
- Keep the implementation small enough to publish immediately.

### Future Releases

- Simplify initial Meshi deployment.
- Generate deployment configuration.
- Validate installation health.
- Assist with upgrades, backups, and recovery.
- Provide a stable administrative interface around supported Meshi deployment patterns.

## Non-Goals

The initial release should not:

- Run the Meshi web application directly.
- Replace Docker Compose.
- Generate a complete production-ready deployment.
- Install or configure Tandoor automatically.
- Manage databases.
- Implement backup or restore logic.
- Expose recipe-management commands.
- Commit to a final configuration-file format.
- Commit to a final deployment architecture.
- Require Meshi application containers to exist before publication.

## Package Identity

```text
Package name: meshi
CLI binary:   meshi
Initial version: 0.0.1
Distribution: public npm package
Runtime: Node.js
```

The package should use the bare npm name:

```bash
npm install --global meshi
```

It should also support temporary execution through:

```bash
npx meshi
```

## Initial Command Surface

The initial release should implement only the following commands:

```bash
meshi --help
meshi --version
meshi init
```

Short aliases should also be supported:

```bash
meshi -h
meshi -v
```

Unknown commands should return a non-zero exit code and print a short error message.

## Minimum Functional Implementation

### `meshi --help`

Print a concise usage message.

Example:

```text
meshi

Usage:
  meshi init       Create a starter Meshi project
  meshi --help     Show help
  meshi --version  Show version
```

### `meshi --version`

Print the installed CLI package version.

Example:

```text
0.0.1
```

### `meshi init`

Create a starter Meshi project directory or a small set of starter files in the current directory.

The first implementation should generate documentation-oriented scaffolding rather than a complete deployment.

Recommended output:

```text
meshi/
  README.md
  meshi.config.example.yaml
```

Example `README.md` contents:

```markdown
# Meshi

This directory was initialized by the Meshi CLI.

Meshi is a self-hosted recipe-library frontend designed to run alongside a Tandoor Recipes backend.

Deployment scaffolding will be expanded in a future release.
```

Example `meshi.config.example.yaml` contents:

```yaml
# Example Meshi configuration.
# The supported configuration format is still under development.

tandoor:
  baseUrl: http://localhost:8080
```

The generated artifacts should be useful enough to establish that the package has working behavior while remaining explicitly provisional.

## File-Safety Requirements

The initial `init` command should avoid destructive behavior.

It should:

- Refuse to overwrite existing files by default.
- Exit with a clear error if the target directory already contains conflicting files.
- Avoid deleting files.
- Avoid modifying unrelated project configuration.
- Avoid creating Docker resources.
- Avoid starting background processes.
- Avoid network requests.

Example error:

```text
Unable to initialize Meshi: README.md already exists.
No files were changed.
```

## Suggested Initial Package Structure

```text
meshi-cli/
  bin/
    meshi.js
  package.json
  README.md
  LICENSE
```

A more structured source layout is not necessary for the first release.

## Suggested Initial `package.json`

```json
{
  "name": "meshi",
  "version": "0.0.1",
  "description": "CLI tools for the Meshi self-hosted recipe library.",
  "license": "MIT",
  "type": "module",
  "bin": {
    "meshi": "./bin/meshi.js"
  },
  "files": ["bin", "README.md", "LICENSE"],
  "engines": {
    "node": ">=20"
  }
}
```

## Initial Release Acceptance Criteria

The `0.0.1` release is complete when:

- `npm install --global meshi` installs successfully.
- `npx meshi --help` prints usage information.
- `npx meshi --version` prints `0.0.1`.
- `npx meshi init` creates starter files.
- Running `meshi init` in a conflicting directory does not overwrite files.
- Unknown commands return a non-zero exit code.
- `npm pack --dry-run` contains only intended files.
- The package includes a README and license.
- The README clearly states that the CLI is early-stage and that deployment automation is still under development.

## Future Functionality

The following ideas are intentionally TBD. They should not be treated as committed scope.

## Deployment Bootstrapping

A future `meshi init` command may generate a complete self-hosted deployment.

Possible output:

```text
meshi/
  compose.yaml
  .env
  .env.example
  meshi.config.yaml
  README.md
  backups/
```

Potential interactive prompts:

- New deployment or existing Tandoor instance
- Public hostname or LAN-only deployment
- Bundled PostgreSQL or external database
- Reverse proxy inclusion
- HTTPS configuration
- Persistent storage paths
- Backup directory
- Supported Tandoor version
- Meshi image tag

Potential usage:

```bash
meshi init
meshi init --existing-tandoor https://recipes.example.com
```

## Docker Lifecycle Management

The CLI may provide convenience wrappers around Docker Compose.

Potential commands:

```bash
meshi up
meshi down
meshi restart
meshi status
meshi logs
```

These commands should remain thin wrappers around transparent Compose operations rather than hiding the underlying deployment model.

## Health Checks

A future diagnostics command may validate a Meshi installation.

Potential usage:

```bash
meshi doctor
```

Potential checks:

- Docker availability
- Container health
- Meshi frontend reachability
- Tandoor API reachability
- Tandoor OpenAPI endpoint availability
- Supported Tandoor version
- Reverse-proxy routing
- Media URL behavior
- Authentication configuration
- Required environment variables
- Writable persistent volumes
- Sidecar database connectivity
- Schema migration state

## Compatibility Validation

Meshi may need to support specific Tandoor versions.

Potential commands:

```bash
meshi compatibility
meshi doctor
meshi upgrade
```

Potential behavior:

- Detect the connected Tandoor version.
- Compare the detected version against Meshi’s supported range.
- Warn before incompatible upgrades.
- Validate the Tandoor OpenAPI schema.
- Report breaking API changes.
- Recommend a compatible Tandoor image tag.

## Upgrade Management

A future CLI may coordinate application upgrades.

Potential usage:

```bash
meshi upgrade
meshi upgrade --check
meshi upgrade --version 1.2.0
```

Potential behavior:

- Check for compatible Meshi releases.
- Validate the current Tandoor version.
- Create a pre-upgrade backup.
- Pull container images.
- Apply Meshi-side migrations.
- Restart services in the required order.
- Run post-upgrade health checks.
- Provide rollback guidance.

## Backup and Restore

A future CLI may provide a consistent backup workflow.

Potential commands:

```bash
meshi backup
meshi restore ./backups/meshi-2026-06-07.tar.gz
```

Potential backup contents:

- Meshi-specific metadata
- Meshi configuration
- PostgreSQL dump
- Uploaded media
- Recipe images
- Deployment version manifest
- Connected Tandoor version
- Docker image tags

Potential behavior:

- Store backups locally.
- Support configurable backup destinations.
- Validate backup integrity.
- Provide dry-run output.
- Support pre-upgrade snapshots.

## Configuration Management

A future CLI may expose configuration commands.

Potential usage:

```bash
meshi config show
meshi config validate
meshi config set tandoor.baseUrl https://recipes.example.com
```

Potential responsibilities:

- Show effective configuration.
- Validate required values.
- Explain invalid settings.
- Generate `.env` files.
- Migrate config formats.
- Redact secrets in terminal output.

## Support Bundles

A future CLI may generate sanitized diagnostics for bug reports.

Potential usage:

```bash
meshi support-bundle
```

Potential contents:

- CLI version
- Meshi image version
- Tandoor version
- Docker Compose service status
- Health-check results
- Sanitized configuration
- Recent logs
- Host runtime information

The command should avoid collecting secrets by default.

## Import and Export

A future CLI may assist with portable data operations.

Potential commands:

```bash
meshi export
meshi import ./recipes.json
```

Potential scope:

- Meshi-specific recipe preferences
- Ingredient sourcing metadata
- Personal notes
- Store metadata
- Tags
- Compatibility-safe export formats

This should remain distinct from Tandoor’s own backup and export behavior.

## Recipe Operations

The CLI may eventually expose selected recipe workflows for automation.

Potential commands:

```bash
meshi recipe import https://example.com/recipe
meshi recipe search pasta
meshi recipe export 123
```

Potential use cases:

- Import recipes from scripts.
- Automate content ingestion.
- Build integrations.
- Support headless workflows.

These commands should be added only if they provide meaningful value beyond calling the Tandoor API directly.

## Scheduled Tasks

The CLI may optionally support generating scheduled backup configuration.

Potential usage:

```bash
meshi backup --schedule daily
```

Possible integrations:

- cron
- systemd timers
- Docker-based scheduled jobs

The CLI should prefer generating transparent configuration rather than maintaining its own always-running daemon.

## Deployment Modes

Future versions may support multiple deployment shapes.

### Bundled Mode

```text
Meshi frontend
Tandoor backend
PostgreSQL
Optional reverse proxy
```

### Existing-Tandoor Mode

```text
Meshi frontend
Optional Meshi sidecar
Existing external Tandoor instance
```

### Advanced Mode

```text
Meshi frontend
Meshi sidecar
External Tandoor instance
External PostgreSQL
Existing reverse proxy
```

The CLI should avoid forcing one deployment style.

## Design Principles

### Keep the Runtime Optional

The Meshi application should run without requiring Node.js or the CLI on the server.

The CLI is an administrative convenience layer, not a runtime dependency.

### Prefer Transparent Artifacts

The CLI should generate inspectable files:

- `compose.yaml`
- `.env`
- YAML configuration
- Markdown documentation
- backup archives

Users should be able to manage the deployment manually after initialization.

### Avoid Lock-In

A user should not need the CLI to:

- start containers
- stop containers
- inspect configuration
- access backups
- edit environment variables
- migrate to a manual deployment

### Avoid Premature Abstraction

Do not build lifecycle commands until the underlying deployment workflow is stable enough to justify them.

### Preserve Compatibility Boundaries

The CLI should treat Tandoor as an external dependency and communicate through supported APIs rather than internal database access.

## Release Strategy

### `0.0.1`

- Publish the package.
- Provide `--help`, `--version`, and `init`.
- Generate small provisional starter artifacts.
- Establish the npm namespace with functional behavior.

### `0.1.x`

Potential additions:

- Generate a basic Compose file.
- Add non-interactive flags.
- Add config validation.
- Document supported deployment patterns.

### `0.2.x`

Potential additions:

- Add `doctor`.
- Add Tandoor API reachability checks.
- Add version compatibility checks.
- Improve generated deployment scaffolding.

### `0.x`

Potential additions:

- Backup and restore
- Upgrade orchestration
- Support bundles
- Existing-Tandoor mode
- Optional sidecar support

### `1.0`

A `1.0` release should require:

- Stable command naming
- Stable configuration format
- Documented deployment modes
- Supported upgrade path
- Clear Tandoor compatibility policy
- Tested backup and recovery workflow
- Predictable non-destructive behavior
