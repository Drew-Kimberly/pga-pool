# PGA Pool - Development Guide

## Project Overview

PGA Pool is a full-stack web application for managing PGA tournament pools. It allows users to pick golfers for tournaments and tracks their performance throughout PGA Tour events.

## Architecture Overview

The project consists of two main components:

### Backend API (`/api`)
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **API Style**: RESTful with OpenAPI specification
- **Key Features**:
  - Tournament management and scoring
  - Player data ingestion from PGA Tour API
  - Pool management with user picks
  - League system for organizing pools
  - Automated score updates via cron jobs

### Frontend Client (`/client`)
- **Framework**: React with TypeScript
- **UI Library**: Grommet
- **State Management**: React hooks and context
- **Routing**: React Router
- **Key Features**:
  - Tournament leaderboard display
  - Tournament field viewing
  - Dark mode support
  - Responsive design

## Common Development Commands

**Important**: Use `yarn --cwd api` or `yarn --cwd client` to run commands from the project root without changing directories. This is the preferred method for running commands.

### API Commands

Assume dependencies are already available within the bash session (i.e. `docker-compose up -d` has been run).

```bash
# Install dependencies
yarn --cwd api install

# Development (with hot reload)
yarn --cwd api start

# Build for production
yarn --cwd api build

# Run linter
yarn --cwd api lint
yarn --cwd api lint:fix

# Run unit tests
yarn --cwd api test

# Run integration tests (requires PostgreSQL on localhost:5430)
yarn --cwd api test:integration

# Database migrations
yarn --cwd api db:migrations:generate -- src/database/migrations/MigrationName
yarn --cwd api db:migrations:run
yarn --cwd api db:migrations:revert

# CLI commands
yarn --cwd api pgapool [command]  # Custom CLI for various operations

# Generate SDK from OpenAPI spec
yarn --cwd api sdk:generate
```

### Client Commands

```bash
# Install dependencies
yarn --cwd client install

# Development server (port 3000)
yarn --cwd client start

# Build for production
yarn --cwd client build

# Run linter
yarn --cwd client lint
yarn --cwd client lint:fix

# Run tests
yarn --cwd client test
```

## High-Level Architecture

### Backend Architecture

1. **Core Modules**:
   - **PGA Tournament**: Manages PGA Tour tournament data
   - **PGA Player**: Handles golfer information
   - **Pool Tournament**: Manages pool instances for tournaments
   - **Pool User**: Tracks user picks and scores
   - **League**: Organizes pools into leagues
   - **User**: User management system

2. **Data Flow**:
   - External PGA Tour API → Ingestion Services → PostgreSQL Database
   - Cron jobs periodically update tournament scores
   - RESTful API endpoints serve data to the client
   - CLI tools provide administrative functions

3. **Key Services**:
   - **PGA Tour API Service**: Integrates with official PGA Tour data
   - **MetaBet API Service**: Additional data source integration
   - **TypeORM List Service**: Handles pagination and filtering
   - **Seed Data Service**: Manages tournament field data

### Frontend Architecture

1. **Component Structure**:
   - **Pages**: Top-level route components
   - **Components**: Reusable UI elements
   - **Contexts**: Shared state management (e.g., theme)
   - **Hooks**: Custom React hooks
   - **API**: Generated SDK for backend communication

2. **Key Components**:
   - **TournamentLeaderboard**: Main view showing pool standings
   - **TournamentField**: Displays available players for a tournament
   - **PoolUserPanel**: Shows individual user's picks and scores
   - **AppBar**: Navigation and app controls

3. **Data Flow**:
   - API SDK fetches data from backend
   - Components render data with real-time updates
   - Local storage persists user preferences

### Database Schema

Key entities and relationships:
- `pga_tournament` ← → `pga_tournament_player` → `pga_player`
- `pool_tournament` → `pool_tournament_user` → `pool_tournament_user_pick`
- `league` ← → `league_user` → `user`

### Development Workflow

1. **Backend Development**:
   - Modify entities in `/api/src/[module]/lib/*.entity.ts`
   - Generate migrations for database changes
   - Update services and controllers
   - Update OpenAPI spec if API changes
   - Regenerate SDK for client

2. **Frontend Development**:
   - Update components in `/client/src/components`
   - Use generated SDK for API calls
   - Test with local API (http://localhost:3000)

3. **Testing**:
   - Unit tests for both API and client
   - API uses Vitest with NestJS testing utilities
   - Client uses React Testing Library
   - API has integration tests that run against a real PostgreSQL instance (see below)

### Environment Setup

1. **Prerequisites**:
   - Node.js >= 20
   - PostgreSQL database
   - Yarn package manager

2. **Configuration**:
   - API: Create `.env` file based on environment variables
   - Client: API URL configured in build process

3. **Seed Data**:
   - Tournament fields stored in `/api/seeds/`
   - Use CLI commands to import seed data

### Key Technologies

- **Backend**: NestJS, TypeORM, PostgreSQL, OpenAPI, Commander CLI
- **Frontend**: React, TypeScript, Grommet, Styled Components
- **Development**: ESLint, Prettier, Jest, Docker support
- **Build**: Nest CLI, Create React App

### Production Deployment

- API: Dockerized NestJS application
- Client: Static build served via CDN
- Database: PostgreSQL with migrations
- API URL: https://api.pga-pool.drewk.dev

### Integration Tests (API)

The API has integration tests that exercise real database operations against a live PostgreSQL instance. These replace heavily-mocked unit tests for services with complex DB interactions (transactions, upserts, GROUP BY aggregations, advisory locks).

**Running**: `yarn --cwd api test:integration` (requires PostgreSQL on `localhost:5430`, or set `POSTGRES_HOST`/`POSTGRES_PORT` env vars).

**How it works**:
1. **Global setup** (`test-helpers/global-setup.ts`): Creates an ephemeral database with a random name, syncs schema via `synchronize: true`, writes the DB name to a temp file.
2. **Test app** (`test-helpers/setup-test-app.ts`): Bootstraps the real `AppModule` with only `PgaTourApiService` mocked (the external HTTP boundary). All DB operations are real.
3. **Teardown**: Drops the ephemeral database after the test run.

**Writing integration tests**:
- File naming: `*.integration.spec.ts` (these are excluded from `yarn test` and only run via `yarn test:integration`)
- Use `setupTestApp().compile()` to bootstrap the NestJS app with real DI
- Use factories from `test-helpers/factories/` to create test data. Factories accept `ds: DataSource` as the first arg, then an optional `opts` object with pre-built entity dependencies and `overrides: Partial<Entity>`.
- Factories auto-create FK dependencies when not provided (e.g., `createPgaTournamentPlayer(ds)` will auto-create a `PgaPlayer` and `PgaTournament`).
- The mock for `PgaTourApiService` is typed as `MockPgaTourApiService` (exported from `setup-test-app.ts`). Get it via `moduleRef.get(PgaTourApiService)`.
- Tests do **not** truncate tables between cases — each test creates its own isolated entity graph with unique IDs. Keep queries scoped to specific entity IDs.

**Config**: `vitest.integration.config.ts` extends the shared base with `pool: 'forks'`, `singleFork: true`, 60s test timeout, 120s hook timeout, and the global setup file.

### Development Notes

- Always update `.env.example` files when adding new env vars to `.env`.
- This is not a production-critical application. Tests are required but we want to favor
high-level component/integration/e2e tests that cover happy paths.
- Always check for and fix lint and TS compiler errors prior to finishing.
- For `client/` changes always confirm that the application compiles and starts successfully before completing.
- For `api/` changes always confirm that the application starts successfully before completing.
- Dependencies should always be pinned in `package.json` (i.e. no SemVer ranges!).
- `console.log` and `console.error` changes should not be committed. Logging must be done with a `Logger` instance from NestJS that's injected as an optional parameter in class constructors like so (no setter necessary in the constructor):
    
    ```ts
    @Optional()
    private logger: LoggerService = new Logger(MyClass.name)
    ```
- Do not include throwaway code (scripts, test controllers, etc) when creating commits / PRs.
- Avoid using `any` as Typescript type unless absolutely necessary.
- Database writes (_especially multiple_) should always use a transaction.

### PR Review Process

When handling PR reviews, follow this systematic approach:

1. **Check for UNRESOLVED Review Comments**:
   ```bash
   gh pr view [PR_NUMBER] --comments
   # Or list review comments with details:
   gh api repos/[OWNER]/[REPO]/pulls/[PR_NUMBER]/comments --jq '.[] | {id: .id, path: .path, line: .line, body: .body, user: .user.login}'
   ```

2. **Address Each Comment**:
   - Fix the issue in the code
   - Test the fix thoroughly
   - Reply to the specific comment thread

3. **Reply to Comments**:
   ```bash
   gh api repos/[OWNER]/[REPO]/pulls/[PR_NUMBER]/comments/[COMMENT_ID]/replies -f body="✅ Fixed in [COMMIT_SHA] - [Brief description of fix]"
   ```

4. **Verification Steps**:
   - Run linters: `yarn lint:fix`
   - Check TypeScript: `yarn build`
   - For API changes: Build and start with `yarn start`
   - For client changes: Build with `yarn build`

5. **Commit Review Fixes**:
   ```bash
   git add -A
   git commit -m "fix: address PR review comments

   - [List each fix with bullet points]
   - [Reference specific comments addressed]
   
   🤖 Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push
   ```

6. **Multiple Review Rounds**:
   - After pushing fixes, check for new comments
   - Repeat the process for each review round
   - Always verify previous fixes still work after new changes

### Pre-Commit Verification Checklist

Before committing any changes, **ALWAYS** run the following verification steps to ensure code quality.
Parallelize the `api` and `client` steps with sub-agents when possible.

1. **API Verification** (if API changes were made):
   ```bash
   yarn --cwd api lint:fix     # Auto-fix linting errors if any
   yarn --cwd api test         # Run all tests and ensure they pass
   yarn --cwd api build        # Ensure API builds successfully
   yarn --cwd api start        # Verify API starts without errors (Ctrl+C to stop)
   ```

2. **Client Verification** (if client changes were made):
   ```bash
   yarn --cwd client lint:fix  # Auto-fix linting errors if any
   yarn --cwd client test      # Run all tests and ensure they pass
   yarn --cwd client build     # Ensure client builds successfully
   ```

3. **Common Issues to Check**:
   - No `console.log` or `console.error` statements (use Logger in API)
   - No unpinned dependencies (remove ^ from version numbers)
   - No `any` types unless absolutely necessary
   - All database writes wrapped in transactions
   - All new env vars added to `.env.example`

4. **Final Steps**:
   - Review all changes with `git diff`
   - Ensure commit message follows project conventions
   - Double-check that all verification commands passed

**Important**: Never skip these verification steps. Running these commands takes only a few minutes but prevents breaking changes and maintains code quality standards.
