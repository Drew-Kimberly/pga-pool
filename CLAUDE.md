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

### API Commands (`cd api/`)

Assume dependencies are already available within the bash session (i.e. `docker-compose up -d` has been run).

```bash
# Install dependencies
yarn install

# Development (with hot reload)
yarn start

# Build for production
yarn build

# Run linter
yarn lint
yarn lint:fix

# Run tests
yarn test

# Database migrations
yarn db:migrations:generate -- src/database/migrations/MigrationName
yarn db:migrations:run
yarn db:migrations:revert

# CLI commands
yarn pgapool [command]  # Custom CLI for various operations

# Generate SDK from OpenAPI spec
yarn sdk:generate

# Run cron job for tournament score updates
yarn cron:tournament-score-updater
```

### Client Commands (`cd client/`)

```bash
# Install dependencies
yarn install

# Development server (port 3000)
yarn start

# Build for production
yarn build

# Run linter
yarn lint
yarn lint:fix

# Run tests
yarn test
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
   - API uses Jest with NestJS testing utilities
   - Client uses React Testing Library

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

### Development Notes

- Always update `.env.example` files when adding new env vars to `.env`.
- This is not a production-critical application. Tests are required but we want to favor
high-level component/integration/e2e tests that cover happy paths.