---
name: pga-pool-picks
description: Generate picks.json for PGA pool tournaments from a tournament field.json and a CSV of team picks. Use when given a field.json path and CSV picks; map team names to league user IDs and player names to PGA player IDs, handle fuzzy/diacritic matches, infer tournament ID from field.json, and write picks.json alongside the field.json.
---

# Workflow

1. Load the provided `field.json` and read `pga_tournament_id` and `player_tiers`. If a tournament ID is not explicitly provided, infer it from `field.json`.
2. Load league and pool seeds to get `league_id` and `pool_id` for the target season. Use `src/seed-data/lib/league.seed.ts` and the relevant `src/seed-data/lib/pools/<year>/pool.seed.ts`.
3. Parse the CSV with columns `Team_Name`, `Tier_num`, and `Player_Name`.
4. Normalize names for matching: trim, casefold, remove punctuation, collapse spaces, and strip diacritics.
5. Map each `Team_Name` to a league user ID by matching against user `name` and `nickname`. Prefer exact matches, then normalized matches. If multiple candidates match, ask for confirmation.
6. Map each `Player_Name` to a PGA player ID by matching against `player_tiers` names. Prefer exact matches, then normalized matches. If multiple candidates match, ask for confirmation.
7. Build `picks` as an object keyed by user ID. Each value is an array of 4 integers where index `0..3` corresponds to tier `1..4`.
8. For any missing or unmapped pick, write `0` in that tier and report the issue.
9. Write `picks.json` in the same directory as the input `field.json`.

# Output Shape

- Root keys: `league_id`, `pool_id`, `pga_tournament_id`, `picks`.
- `picks` values are always arrays of length 4.

# Built-in Schema

Use this schema as the expected output shape (do not ask the user to paste it):

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Pool Picks Schema",
  "type": "object",
  "properties": {
    "league_id": {
      "type": "string",
      "description": "League ID",
      "example": "15b26666-819a-460c-b7c2-2b2feb1613e2"
    },
    "pool_id": {
      "type": "string",
      "description": "Pool ID",
      "example": "64033d48-0083-406f-9847-d0d096c3fbfd"
    },
    "pga_tournament_id": {
      "type": "string",
      "description": "PGA Tournament ID",
      "example": "R2026004"
    },
    "picks": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "items": {
          "type": "integer",
          "description": "The PGA Player ID. The index of each value corresponds to the tier of the pick, i.e. index=1 correponds to tier 2. A value of 0 indicates no pick was made."
        },
        "minLength": 4,
        "maxLength": 4
      }
    }
  },
  "required": [
    "league_id",
    "pool_id",
    "pga_tournament_id",
    "picks"
  ]
}
```

# Checks

- Ensure the `field.json` tournament ID matches any explicitly requested tournament ID before writing output.
- Ensure every CSV row targets tiers 1 through 4 only.
- Report any ambiguous or missing team or player matches before finalizing.
