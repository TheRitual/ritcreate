# Nest + React + gRPC Project Template Generator

A template generator for creating monorepo projects with NestJS, React, and gRPC.

## Quick Start

Run the project generator:

```bash
npm run create
# or
node create-project.mjs
# or (with project name; creates ./<name> by default)
ritcreate new-project
```

### Install and run as `ritcreate` (JSR package @ritual/ritcreate)

- **npm / npx:** `npx jsr:@ritual/ritcreate new-project` — creates `./new-project` in the current directory (Windows, Mac, Linux).
- **Deno:** `deno run -A jsr:@ritual/ritcreate new-project` or install globally: `deno install -n ritcreate -g -A jsr:@ritual/ritcreate` (use `-A` or at least `--allow-read --allow-write --allow-net`) then `ritcreate new-project`.

Optional second argument is the output directory; default is `./<monorepo-name>`.

The interactive CLI will guide you through:
- Project name and package scope
- Database configuration (PostgreSQL)
- Testing setup (Vitest, Playwright)
- Storybook for UI components
- Docker configuration
- Git initialization
- Husky for git hooks

## What Gets Created

The generator creates a complete Turborepo monorepo with:

- **Apps**
  - `apps/api` - NestJS backend with gRPC support
  - `apps/web` - React frontend with Vite

- **Packages**
  - `packages/ui` - Shared React components
  - `packages/protos` - gRPC protocol definitions
  - `packages/eslint-config` - Shared ESLint configuration
  - `packages/typescript-config` - Shared TypeScript configurations
  - `packages/vitest-config` - Shared Vitest configuration

## Features

- ✅ **Monorepo** - Turborepo for efficient builds
- ✅ **TypeScript** - Full type safety
- ✅ **Testing** - Vitest for unit tests, Playwright for E2E
- ✅ **Linting** - ESLint with Prettier
- ✅ **Git Hooks** - Husky with lint-staged
- ✅ **Docker** - Development and production images
- ✅ **Database** - PostgreSQL with migrations (optional)
- ✅ **Storybook** - Component documentation (optional)

## Repository Structure

```
.
├── package.json          # Template generator package
├── create-project.mjs   # Main generator script
├── template/             # Template files (used by generator)
└── README.md            # This file
```

## Usage

1. Clone this repository
2. Run `npm run create`
3. Follow the interactive prompts
4. Start coding in your new project!

## Publishing to JSR (CI/CD)

The repo is set up to publish the package **@ritual/ritcreate** to [JSR](https://jsr.io) via GitHub Actions:

1. Create the package **@ritual/ritcreate** on [jsr.io](https://jsr.io/new) and link it to this GitHub repository (package settings → GitHub repository).
2. Push to `main` or run the **Publish to JSR** workflow manually; it runs `npx jsr publish` and uses OIDC (no secrets required).

Workflow file: `.github/workflows/publish-jsr.yml`. Package config: `jsr.json`.

## License

[Your License Here]
