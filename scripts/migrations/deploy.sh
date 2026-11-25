#!/usr/bin/env bash
# Run only from a reviewed checkout with environment-scoped migration credentials.
set -euo pipefail
case "${1:-}" in plan|apply) ;; *) echo 'Expected plan or apply'; exit 2;; esac
: "${MIGRATION_DB_URL:?Missing environment database URL}" "${MIGRATION_DATABASE_CA:?Missing database certificate}"
# Require an explicit, verified connection with no conflicting libpq URL overrides.
python3 - <<'PY'
import os, sys
from urllib.parse import urlsplit, parse_qsl, unquote
url = urlsplit(os.environ["MIGRATION_DB_URL"])
if (url.scheme not in {"postgresql", "postgres"} or not url.hostname or not url.password
        or not url.username or unquote(url.username).split(".")[0] == "ezra_checkout"
        or parse_qsl(url.query) != [("sslmode", "verify-full")]):
    sys.exit("Configure a migration login and sslmode=verify-full as the sole URL option")
PY
umask 077
cert=$(mktemp)
trap 'rm -f "$cert"' EXIT
printf '%s\n' "$MIGRATION_DATABASE_CA" > "$cert"
export PGSSLROOTCERT="$cert" PGSSLMODE=verify-full
identity=$(psql "$MIGRATION_DB_URL" -XAtq -v ON_ERROR_STOP=1 -c "select current_user <> 'ezra_checkout' and session_user <> 'ezra_checkout'")
[[ "$identity" == t ]] || { echo 'Migration owner required'; exit 1; }

supabase migration list --remote="$MIGRATION_DB_URL"
# Require baseline adoption even on an empty project. A missing table also stops the job.
applied=$(psql "$MIGRATION_DB_URL" -XAtq -v ON_ERROR_STOP=1 -c 'select version from supabase_migrations.schema_migrations order by version')
local_versions=$(for file in supabase/migrations/*.sql; do basename "$file" | cut -d_ -f1; done)
[[ "${applied%%$'\n'*}" == 20261125202908 ]] || { echo 'Reconcile the baseline before deployment'; exit 1; }
[[ "$local_versions"$'\n' == "$applied"$'\n'* ]] || { echo 'Remote history diverges from the reviewed files'; exit 1; }
supabase db push --remote="$MIGRATION_DB_URL" --skip-vault --dry-run
if [[ "$1" == apply ]]; then
  supabase db push --remote="$MIGRATION_DB_URL" --skip-vault --yes
  applied=$(psql "$MIGRATION_DB_URL" -XAtq -v ON_ERROR_STOP=1 -c 'select version from supabase_migrations.schema_migrations order by version')
  [[ "$local_versions" == "$applied" ]] || { echo 'Post-deployment history mismatch'; exit 1; }
fi
