# Tournament Leaderboard UX Redesign

## Overview

A multi-PR overhaul of the Tournament Leaderboard view to provide a rich, data-dense,
mobile-first experience. The redesign follows a **modern editorial** aesthetic
(The Athletic / Apple Sports) with distinctive typography, muted palettes, and
purposeful motion.

## Design Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Aesthetic | Modern editorial | Clean typography, generous whitespace, subtle card elevations, warm muted palette |
| View model | Pool-user accordion | Keep pool users as top-level rows; their picks expand below |
| Player detail | Slide-over panel (bottom sheet) | Tapping a player opens a mobile-native bottom sheet with full detail |
| Scoring display | Pool score + golf score | Pool score prominent; golf scores always visible per player. No toggle. |
| Player chips | Headshot circles | Mini headshot circles in the accordion header row for at-a-glance pick visibility |
| Tournament header | Enhanced | Course name, par, purse, status badge, round progress |
| FedEx Cup toggle | Removed | Scoring always follows the pool's configured `scoring_format` |
| Font pairing | Fraunces + Bricolage Grotesque (working choice) | 3 preview PRs will be opened during PR 4 for final comparison |

## Data Model

### Scoring Data Hierarchy

The scoring data model is designed for both immediate UX needs and future data analysis.
Two new tables store granular scoring data; round totals and scorecards are derived via queries.

```
pga_tournament_player (existing)
│
├── pga_tournament_player_hole (new)
│   One row per hole played per round.
│   Source: leaderboardHoleByHole GraphQL query.
│   ├── id (uuid, PK)
│   ├── pga_tournament_player_id (FK → pga_tournament_player.id)
│   ├── round_number (int, 1-4)
│   ├── hole_number (int, 1-18)
│   ├── par (int, 3-5)
│   ├── score (int, strokes taken on this hole)
│   ├── to_par (int, score - par)
│   ├── status (enum: birdie, bogey, eagle, double_bogey, par)
│   ├── yardage (int)
│   ├── sequence (int, playing order for shotgun starts)
│   └── UNIQUE(pga_tournament_player_id, round_number, hole_number)
│
└── pga_tournament_player_stroke (new)
    One row per individual shot (ShotLink data).
    Source: shotDetailsV3 GraphQL query.
    ├── id (uuid, PK)
    ├── pga_tournament_player_hole_id (FK → hole.id)
    ├── stroke_number (int, 1-N)
    ├── from_location (varchar — "Tee", "Fairway", "Rough", "Bunker", "Green")
    ├── from_location_code (varchar)
    ├── to_location (varchar)
    ├── to_location_code (varchar)
    ├── stroke_type (enum: stroke, penalty, drop, provisional)
    ├── distance (varchar — as provided by API, e.g., "285 yds")
    ├── distance_remaining (varchar)
    ├── play_by_play (text — descriptive shot narrative)
    ├── is_final_stroke (boolean)
    │
    │  — ShotLink / Radar data (nullable, populated when available) —
    ├── ball_speed (decimal, nullable, mph)
    ├── club_speed (decimal, nullable, mph)
    ├── smash_factor (decimal, nullable)
    ├── launch_angle (decimal, nullable, degrees)
    ├── launch_spin (decimal, nullable, rpm)
    ├── spin_axis (decimal, nullable, degrees)
    ├── apex_height (decimal, nullable, feet)
    ├── start_x (decimal, nullable)
    ├── start_y (decimal, nullable)
    ├── end_x (decimal, nullable)
    ├── end_y (decimal, nullable)
    └── UNIQUE(pga_tournament_player_hole_id, stroke_number)
```

### Derived Queries

**Per-round scores (for leaderboard player rows):**
```sql
SELECT round_number, SUM(score) as strokes, SUM(to_par) as to_par
FROM pga_tournament_player_hole
WHERE pga_tournament_player_id = :id
GROUP BY round_number
ORDER BY round_number
```

**Scorecard (for slide-over panel):**
```sql
SELECT hole_number, par, score, to_par, status, yardage
FROM pga_tournament_player_hole
WHERE pga_tournament_player_id = :id AND round_number = :round
ORDER BY sequence
```

### PGA Tour GraphQL Data Sources

| Query | Data Provided | Used For |
|-------|---------------|----------|
| `leaderboardCompressedV3` | Player totals, position, status, tee times | Existing leaderboard (unchanged) |
| `leaderboardHoleByHole(tournamentId, round)` | All players' hole-by-hole scores for a round | `pga_tournament_player_hole` ingestion |
| `shotDetailsV3(tournamentId, playerId, round)` | Shot-by-shot data with coordinates, lie, distance | `pga_tournament_player_stroke` ingestion |
| `shotDetailsV3(..., includeRadar: true)` | Ball speed, club speed, launch angle, trajectory | Stroke radar columns |

### Odds Data

- `PoolTournamentPlayer.odds` (string, nullable) — Snapshotted at field creation. Represents the odds
  used to build the pool field tiers. Immutable after field generation. Surfaced on `PoolTournamentUserPickDto`
  so the client can display odds alongside each user's picks.
- **Live odds (`PgaTournamentPlayer.odds`) descoped** — The PGA Tour leaderboard API returns empty
  `oddsToWin` for completed tournaments, making historical backfill impossible. Live odds may be
  revisited in a future PR with an alternative data source or forward-only capture during active tournaments.

## Architecture Diagram

```
┌─────────────────────────────────┐
│   TOURNAMENT HEADER (enhanced)  │
│  Name · Course · Par · Purse    │
│  Status badge · Round progress  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  POOL USER ROW (accordion)      │
│  #1  Drew K.             -24   │
│  (●)(●)(●)(●)                   │  ← headshot circles
├─────────────────────────────────┤
│  ▼ Expanded picks:              │
│  T3  Scottie Scheffler  -8  F  │  ← tappable rows
│  T12 Rory McIlroy       -5  15 │
│  CUT Justin Thomas      +3     │
│  T45 Cam Smith          -3  F  │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  #2  Mike S.             -18   │
│  (●)(●)(●)(●)                   │
└─────────────────────────────────┘

        ┌──── TAP PLAYER ────┐
        ▼
┌─────────────────────────────────┐
│  ══ SLIDE-OVER PANEL ══        │  ← bottom sheet
│  ┌──┐                          │
│  │  │ Scottie Scheffler  🇺🇸    │
│  └──┘ T3 · -8 · Thru F        │
│                                │
│  R1: 66  R2: 68  R3: 64  R4: -│
│                                │
│  Field: +550   Live: +400      │
│                                │
│  ┌─ SCORECARD (R3) ───────────┐│
│  │ 1  2  3  4  5  6  7  8  9 ││
│  │ 4  4  3  5  4  3  4  4  4 ││  par
│  │ 3  4  2  5  3  3  4  4  3 ││  score
│  │ ●     ●     ●           ● ││  birdie dots
│  │ Out: 31                    ││
│  └────────────────────────────┘│
└─────────────────────────────────┘
```

## Color System

### Scoring Colors
| Context | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Birdie (under par) | Green | Green |
| Bogey (over par) | Red/crimson | Soft red |
| Eagle | Gold/amber | Gold |
| Double bogey+ | Dark red | Dark red |
| Par | Neutral/muted | Neutral/muted |
| Even score | Neutral text | Neutral text |

### Status Colors
| Status | Indicator |
|--------|-----------|
| IN_PROGRESS (live) | Pulsing green dot |
| COMPLETED | Checkmark badge |
| NOT_STARTED | Muted/gray |
| CUT | Red strikethrough |
| WD | Red strikethrough |

## Typography

**Direction**: Modern editorial — distinctive display font for headings/scores paired
with a refined body font for names/labels.

**Working choice**: Fraunces (display) + Bricolage Grotesque (body)

During PR 4 (design system foundations), 3 separate preview PRs will be opened so the
final font pairing can be evaluated in-browser before merging:

### Option 1: Classic Editorial — "The Augusta"
- **Display**: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (300-700 + italics)
- **Body**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (200-800 variable)
- **Vibe**: Print-magazine sophistication. Serif + Sans. Safest option.
- **Scores**: Cormorant 600-700 — old-style, elegant numerals
- **Labels**: Jakarta 400-500 — geometric, soft, excellent small-size legibility

### Option 2: Geometric Modern — "The Apple Sports"
- **Display**: [Sora](https://fonts.google.com/specimen/Sora) (100-800 variable)
- **Body**: [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) (400-700 variable + width axis)
- **Vibe**: Sports-tech product interface. Sans + Sans. Middle ground.
- **Scores**: Sora 700-800 — geometric, large x-height, clear numerals
- **Labels**: Instrument 400-500 — precise with humanist touches, condensable

### Option 3: Characterful Editorial — "The New Wave" (working choice)
- **Display**: [Fraunces](https://fonts.google.com/specimen/Fraunces) (100-900 variable, axes: Weight, Optical Size, Softness, Wonk)
- **Body**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) (200-800 variable, axes: Weight, Width, Optical Size)
- **Vibe**: Confident editorial with personality. Soft-serif + neo-grotesque. Most distinctive.
- **Scores**: Fraunces 600-800 (WONK: 0, SOFT: 0-25) — warm, adaptive numerals
- **Labels**: Bricolage 400-500 (wdth: 87.5-100) — expressive ink traps, condensable

### Weight Mapping (Option 3)
| Element | Font | Weight | Axes |
|---------|------|--------|------|
| Tournament title / headers | Fraunces | 700 | WONK: 0, SOFT: 0, opsz: auto |
| Rank numbers | Fraunces | 800 | WONK: 0, SOFT: 0 |
| Total score (e.g. "-12") | Fraunces | 600 | WONK: 0, SOFT: 25 |
| Player names | Bricolage Grotesque | 500 | wdth: 100 |
| Round scores, labels | Bricolage Grotesque | 400 | wdth: 100 |
| Meta text (tee times, status) | Bricolage Grotesque | 300 | wdth: 87.5 |

## PR Plan

### Phase 1: Backend / API (3 PRs)

#### PR 1 — Scoring data tables + ingestion ✅ Merged (#241)

Created the `pga_tournament_player_hole` and `pga_tournament_player_stroke` tables,
ingested hole-level and shot-level data from the PGA Tour GraphQL API, and exposed
round scores and scorecard data via API endpoints.

**Implemented:**
- Migration: `1777300000000-AddHoleAndStrokeTables.ts`
- Entities: `PgaTournamentPlayerHole`, `PgaTournamentPlayerStroke` (separate modules)
- GraphQL operations: `LeaderboardHoleByHole.graphql`, `ShotDetailsV3.graphql`
- API methods: `getLeaderboardHoleByHole()`, `getShotDetails()`
- Ingestion services: `PgaTournamentPlayerHoleService`, `PgaTournamentPlayerStrokeService`
- Cron integration: scoring data ingested after leaderboard update
- Endpoints: `GET /pga-tournament-players/:id/rounds`, `GET /pga-tournament-players/:id/scorecard?round=N`
- OpenAPI spec + client SDK regenerated
- 19 unit tests across both service spec files

#### PR 2 — Surface field-snapshot odds on pick DTO ✅ Merged (#247)

Exposed the existing `PoolTournamentPlayer.odds` (pre-tournament field-snapshot odds)
through the `PoolTournamentUserPickDto` so the client can display odds alongside picks.

**Implemented:**
- Added `odds: string | null` to `PoolTournamentUserPickDto` with `fromEntity()` mapping
- Updated OpenAPI spec (`PoolTournamentUserPick` schema)
- Regenerated client SDK

**Descoped:** `PgaTournamentPlayer.odds` (live-polled odds) was removed from this PR.
The PGA Tour API does not return `oddsToWin` for completed tournaments, making historical
backfill impossible. Live odds may be revisited in a future PR with a different data source
or captured only going forward during active tournaments.

#### PR 3 — Leaderboard API enrichment ✅ Merged (#248)

Added course par and yardage to `PgaTournament` for the redesigned leaderboard header.
Round scores and scorecards remain as separate on-demand endpoints (not embedded in the
leaderboard response) — they will be fetched by the slide-over panel in PR 7.

**Implemented:**
- GraphQL operation: `CourseStats.graphql` + `getCourseStats()` service method
- Migration: `1777500000000-AddPgaTournamentParAndYardage.ts` (`par` int, `yardage` int)
- Entity: `PgaTournament.par`, `PgaTournament.yardage` (both nullable int)
- DTO: `PgaTournamentDto.par`, `PgaTournamentDto.yardage` with `fromEntity()` mapping
- Ingestion: courseStats fetched per tournament during `PgaTournamentIngestor.ingest()`;
  host course preferred when multiple courses exist; failures logged without blocking
- Yardage parsed from comma-formatted API string (e.g. "7,261") to integer (7261)
- Tournament `save()` wrapped in `dataSource.transaction()` to fix pg deprecation warning
- OpenAPI spec + client SDK regenerated
- 5 unit tests for courseStats ingestion

### Phase 2: Client (4 PRs)

#### PR 4 — Design system foundations + Tab navigation + Enhanced tournament UX 🔄 In Review (#253)

Establishes the visual language and introduces a major architectural overhaul of tournament
page navigation. Font pairing finalized as **Fraunces + Bricolage Grotesque** ("New Wave").

**Implemented:**
- **Design tokens**: `client/src/theme/tokens.css` — CSS custom properties for typography scale,
  font weights, scoring colors (eagle/birdie/par/bogey), status colors (live/official/thisweek/
  upcoming/pending), tab bar, elevation shadows, animations. Full dark mode via `[data-theme="dark"]`.
- **Font loading**: Google Fonts `<link>` in `index.html` with `preconnect` hints; Grommet theme
  `global.font.family` set to Bricolage Grotesque
- **Dark mode sync**: `ThemeContext` sets `document.documentElement.dataset.theme` via `useEffect`
- **Tab navigation architecture**: `TournamentLayout` component with shared header + tab bar +
  React Router `<Outlet>`. Nested routes: `/overview`, `/leaderboard`, `/results`, `/field`.
  Smart default redirect based on tournament status. Conditional tabs (Leaderboard only when
  IN_PROGRESS, Results only when COMPLETED, Field only when player tiers available).
- **Tournament header**: Logo circle + name (Fraunces) + course/location + date + always-visible
  status badge. Status variants: live (green + pulsing dot), official (solid green fill),
  thisweek (indigo/violet), upcoming (gray), pending (amber).
- **TournamentOverview**: Course section (image, name, par, yardage), Event Details (purse,
  FedEx pts), Previous Champion (headshot, name, country flag via `GET /pga-players/:id`).
- **Pool navigation simplification**: Tournaments + Standings by default; conditional "Live" tab
  with pulsing dot when tournament IN_PROGRESS.
- **Tournament list cards**: Smart redirect, conditional "View leaderboard" (IN_PROGRESS only),
  "Event overview" link, distinct "This Week" badge color, field unavailable empty state.
- **API**: `GET /pga-players/:pgaPlayerId` endpoint + OpenAPI spec + SDK regeneration.
- **Deleted**: `PoolTournamentLeaderboardPage`, `PoolTournamentResultsPage`,
  `PoolTournamentFieldPage`, `TournamentLeaderboardPage` — replaced by nested route children.

**Known issue (deferred):** `previous_champion` from PGA Tour API returns the current year's
champion for completed tournaments, not the defending champion. Requires a DB migration and
backend work to properly snapshot the defending champion at tournament creation time.

#### PR 5 — Scoring + Pool user row + Pick row redesign 🔄 In Progress

Combined original PRs 5 (scoring/toggle removal) and 6 (pool user row redesign). Client-only —
all data needed (headshots, tiers, odds, positions, thru, round status) already present in API.

**Implemented:**
- **FedEx toggle removed**: `scoringFormat` derived from pool settings, no toggle UI
- **Scoring color system**: `getScoreColor()` utility returns CSS custom properties
  (birdie/even/bogey). CUT players use `--color-status-cut` token.
- **PlayerHeadshot component**: Reusable circular headshot with initials fallback (`getPlayerInitials()`),
  optional 2px colored border ring for score status, `onError` fallback to initials.
- **Pool user header redesign** (two-line accordion header):
  - Line 1: Rank badge + Nickname + Compact round status + Score (Fraunces display font) + Chevron
  - Line 2: Row of 24px headshot chips per pick, score-colored border rings, CUT/WD reduced opacity
  - Round status compacted: `"Starts in Xh Ym"` | `"XX%"` | `"Complete ✓"` (no Meter/Tip)
- **Pick row redesign** (labeled metadata, no ambiguous floating values):
  - Line 1: 32px headshot circle + `PgaPlayerName` (fills space) + right-aligned color-coded pool score
  - Line 2: Labeled metadata joined by ` · `: `Pos T3`, `Thru 15`, `Tier 1`, `Odds +550`
  - FedEx pools: `To Par -8` in metadata when pool score differs from golf score
  - CUT/WD: reduced opacity (0.5), only Tier + Odds metadata
  - Not started: `Starts in Xh Ym` or `Not Started` in metadata
  - Round complete: `Round Complete ✓` in metadata
  - Subtle bottom border between picks using `--color-tab-border`
- **Utility functions**: `isCutOrWithdrawn()`, `getPlayerInitials()`, `getPickStatusLabel()`,
  `buildPickMetadata()` — pure functions for testable presentation logic
- **Cleanup**: Removed `Meter`, `Tip` imports from PoolUserPanel; removed `tournamentRound` prop;
  removed `round` variable derivation from TournamentLeaderboard

#### PR 6 — Player slide-over panel
- Bottom sheet component (slides up, draggable dismiss, backdrop blur)
- Header: headshot, full name, country flag, position
- Scoring strip: total score, today's score, thru
- Round scores row: R1-R4 with color coding (from PR 1 rounds endpoint)
- Odds section: field odds + live odds with delta indicator
- Scorecard (on-demand API call from PR 1): front 9 / back 9 grid, par/score rows, birdie/bogey indicators

#### PR 7 — Polish, animations, and responsive refinement
- Page-load stagger animation (header → rows cascade)
- Slide-over transitions (spring physics)
- Score update fade transitions
- Player chip hover/press states
- Landscape mobile + tablet breakpoints
- Accessibility: focus management, keyboard nav, ARIA
- Performance: lazy scorecard loading, list virtualization if needed

## Ingestion Strategy

### Hole Data (`leaderboardHoleByHole`)
- Fetched **per round** — one API call returns all players' holes for that round
- Efficient: 1 call per active round (typically 1-2 during live play)
- Ingested during cron alongside the main leaderboard update
- Upsert on unique constraint (player_id, round_number, hole_number)

### Stroke Data (`shotDetailsV3`)
- Fetched **per player per round** — requires individual calls
- Rate-limited: only fetch for players with new `score_thru` changes since last poll
- Concurrency-limited (e.g., 5-10 parallel requests) to avoid API throttling
- Only fetch for active/in-progress rounds (skip completed rounds already ingested)
- Radar data (`includeRadar: true`) fetched opportunistically

### Performance Considerations
- Hole data: ~1-2 API calls per cron run (very lightweight)
- Stroke data: worst case ~150 players x 1 round = 150 calls, but filtered by
  `score_thru` changes = typically 20-40 calls per run
- Both use upsert with unique constraints for idempotent updates

## Process

Each PR will receive a **deep-dive planning pass** before implementation begins.
The deep-dive will:
1. Identify exact files to create/modify
2. Clarify data shapes and interfaces
3. Resolve open questions specific to that PR
4. Produce a detailed implementation checklist

PRs are implemented **sequentially** — each PR is completed, reviewed, and merged
before the next begins.
