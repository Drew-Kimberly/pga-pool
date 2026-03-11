#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────
# Sync local PostgreSQL database from deployed DB
# Usage: yarn db:sync-from-deployed
# Requires: DEPLOYED_DATABASE_CONNECTION_STRING env var
# ─────────────────────────────────────────────────

# Load .env if present (simple parser — no interpolation)
ENV_FILE="${BASH_SOURCE[0]%/*}/../.env"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -v '^\s*#' "$ENV_FILE" | grep -v '^\s*$' | sed "s/='\\(.*\\)'/=\\1/")
  set +a
fi

# ── Config ────────────────────────────────────────
LOCAL_HOST="${POSTGRES_HOST:-localhost}"
LOCAL_PORT="${POSTGRES_PORT:-5430}"
LOCAL_DB="${POSTGRES_DB:-pgapoolapi}"
LOCAL_USER="${POSTGRES_USER:-postgres}"
LOCAL_PASSWORD="${POSTGRES_PASSWORD:-postgres}"

DEPLOYED_URL="${DEPLOYED_DATABASE_CONNECTION_STRING:-}"

if [[ -z "$DEPLOYED_URL" ]]; then
  echo "ERROR: DEPLOYED_DATABASE_CONNECTION_STRING is not set."
  echo "Set it in your .env or export it before running this script."
  exit 1
fi

export PGPASSWORD="$LOCAL_PASSWORD"

# ── Preflight checks ─────────────────────────────
echo "Checking local PostgreSQL on ${LOCAL_HOST}:${LOCAL_PORT}..."
if ! pg_isready -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -q 2>/dev/null; then
  echo "ERROR: Local PostgreSQL is not reachable at ${LOCAL_HOST}:${LOCAL_PORT}."
  echo "Is docker-compose up?"
  exit 1
fi

echo "Checking deployed database connection..."
if ! pg_isready -d "$DEPLOYED_URL" -q 2>/dev/null; then
  echo "WARNING: pg_isready could not verify deployed DB (may still work)."
fi

# ── Terminate existing connections ────────────────
echo "Terminating existing connections to '${LOCAL_DB}'..."
psql -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d postgres -tAc \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${LOCAL_DB}' AND pid <> pg_backend_pid();" \
  >/dev/null 2>&1 || true

# ── Drop & recreate local database ───────────────
echo "Dropping local database '${LOCAL_DB}'..."
dropdb --if-exists -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB"

echo "Creating fresh database '${LOCAL_DB}'..."
createdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB"

# ── Dump deployed → restore local ────────────────
# pg_restore exits non-zero when it encounters unsupported extensions or
# version-specific SET parameters (e.g. pg_stat_kcache, transaction_timeout).
# These are harmless — all user data and schema still restore correctly.
echo "Syncing from deployed database (this may take a moment)..."
RESTORE_OUTPUT=$(pg_dump --format=custom --no-owner --no-acl "$DEPLOYED_URL" \
  | pg_restore --no-owner --no-acl -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" 2>&1) || true

if [[ -n "$RESTORE_OUTPUT" ]]; then
  echo "pg_restore warnings (non-fatal):"
  echo "$RESTORE_OUTPUT" | head -20
fi

# ── Sanity check ─────────────────────────────────
echo ""
echo "Sync complete. Row counts for key tables:"
echo "──────────────────────────────────────────"
for table in pga_tournament pga_player pga_tournament_player pool_tournament pool_tournament_user; do
  count=$(psql -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" -tAc "SELECT count(*) FROM ${table}" 2>/dev/null || echo "?")
  printf "  %-30s %s\n" "$table" "$count"
done
echo "──────────────────────────────────────────"
echo "Done. You can now start the API: yarn --cwd api start"
