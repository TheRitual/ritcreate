# @ritual/ritcreate

Template generator for monorepo projects with NestJS, React, and gRPC.

## Creating a new project

### From this repository (Node)

```bash
# Interactive: prompts for name, scope, options
npm run create

# Or run the script directly (same as above)
node create-project.mjs

# With project name (creates ./<name> by default)
node create-project.mjs my-app

# With project name and output directory
node create-project.mjs my-app ./path/to/output
```

**Non-interactive (defaults):** use `--yes` or `-y` so the generator skips prompts and uses defaults:

```bash
node create-project.mjs my-app ./my-app --yes
```

### Using the published package (JSR)

**npm / npx (no install):**

```bash
npx jsr:@ritual/ritcreate my-app
# Optional: specify output directory (default is ./my-app)
npx jsr:@ritual/ritcreate my-app ./output-dir
```

**Deno (one-off run):**

```bash
deno run -A jsr:@ritual/ritcreate my-app
deno run -A jsr:@ritual/ritcreate my-app ./output-dir
```

Use `-A` (allow all) or at least `--allow-read --allow-write --allow-net`.

### Install globally with Deno (@ritual/ritcreate)

Install the generator as a global `ritcreate` command so you can run it from anywhere:

```bash
deno install -n ritcreate -A jsr:@ritual/ritcreate
```

Then create projects with:

```bash
ritcreate my-app
ritcreate my-app ./output-dir
```

To allow only the required permissions instead of `-A`:

```bash
deno install -n ritcreate --allow-read --allow-write --allow-net jsr:@ritual/ritcreate
```

The installed script is placed in Deno’s bin directory (e.g. `~/.deno/bin`). Ensure that directory is on your `PATH`.

## Testing the template

Use these from the **ritcreate** repo (this repository), not from a generated project.

### Quick dev run (recommended)

Runs the full stack against a freshly generated project so you can verify the template works end-to-end:

1. Generates a project into `.ritcreate-dev` with default options (`--yes`).
2. Builds the project.
3. Starts Docker (Postgres, Envoy gRPC-Web, gRPCui) and runs the API and Web app in watch mode.

```bash
npm run dev
```

Then:

- Open **http://localhost:3000** for the frontend.
- Wait until you see **"Backend ready"** in the terminal (and optionally **"API listening on http://0.0.0.0:4000"**) before using the app.
- Stop with **Ctrl+C**.

The script removes any existing `.ritcreate-dev` before creating a new one, so each run tests a clean generation.

### Template verification (CI-style)

Runs unit tests and E2E tests on a copy of the template with placeholders replaced (no interactive prompts). Use this to validate the template in CI or before releasing.

```bash
npm run verify-template
```

This script:

1. Copies the template to a temp directory and replaces placeholders (e.g. `{{REPO_NAME}}`, `{{SCOPE}}`).
2. Runs `npm install`, `npm run test`, and `npm run test:e2e` (Playwright installs Chromium if needed).

If it exits with code 0, the template is considered valid.

### Manual test of a generated project

After creating a project (e.g. with `npm run create` or `ritcreate my-app`):

```bash
cd my-app
npm install
npm run build
npm run dev
```

Then open http://localhost:3000 and run `npm run health-check` from the repo root to verify the API.

## What gets created

The generator produces a Turborepo monorepo with:

- **Apps**
  - `apps/api` – NestJS backend with gRPC (Fastify, health + hello)
  - `apps/web` – React frontend (Vite, Emotion)

- **Packages**
  - `packages/ui` – Shared React components (Storybook)
  - `packages/protos` – gRPC proto definitions and generated clients
  - `packages/eslint-config` – Shared ESLint config
  - `packages/typescript-config` – Shared TypeScript configs
  - `packages/vitest-config` – Shared Vitest config

The interactive CLI lets you choose:

- Project name and package scope
- Database (PostgreSQL) and migrations
- Testing (Vitest, Playwright)
- Storybook for UI components
- Docker (dev and prod Compose)
- Git init and Husky git hooks

## Repository structure (ritcreate repo)

```
.
├── package.json
├── create-project.mjs    # Main generator (Node)
├── mod.ts                # Entry for Deno/JSR (fetches template, runs Node script)
├── template/             # Template files used by the generator
├── template-manifest.json
├── scripts/
│   ├── dev.mjs           # npm run dev: create into .ritcreate-dev and run stack
│   └── verify-template.mjs
├── jsr.json
└── README.md
```

## Features

- Monorepo with Turborepo
- TypeScript everywhere
- Testing: Vitest (unit), Playwright (E2E)
- Linting: ESLint + Prettier
- Git hooks: Husky + lint-staged
- Docker: dev and production Compose
- Database: PostgreSQL with optional migrations
- Storybook for the UI package

## Publishing to JSR

The package **@ritual/ritcreate** is published to [JSR](https://jsr.io) via GitHub Actions:

1. Create the package **@ritual/ritcreate** on [jsr.io](https://jsr.io/new) and link it to this repository.
2. Push to `main` or run the **Publish to JSR** workflow manually; it uses `npx jsr publish` and OIDC (no stored secrets).

Workflow: `.github/workflows/publish-jsr.yml`. Package config: `jsr.json`.

## License

MIT
