# SK Tape Ball Academy — updated review package

This package preserves the source project and adds a separate static-review copy of Task 4 v15.

## Migration files

- `task4_migration_v15.sql` is the original file from the provided ZIP. It is unchanged and has nested `$$` delimiters in Steps 8 and 9; do not execute it.
- `task4_migration_v15_reviewed_candidate.sql` fixes those delimiters and adds a preflight guard for the `ON DELETE SET NULL` column nullability. It has only been reviewed statically. It has not been tested with a PostgreSQL parser or against a database and is not ready to execute.
- Read `TASK4_v15_AUDIT.md` and review the read-only checks in `TASK4_v15_DATABASE_DIAGNOSTICS.sql` before planning any execution.

## Project setup and secrets

- `.env.local` was omitted because it was present in the source archive and can contain credentials.
- Use `.env.example` as the configuration template. Never place Supabase service-role or secret keys in frontend variables or a shared ZIP.
- `dist/` was rebuilt from the provided source. `node_modules/` and `bun.lock` are included from the source package.

No SQL was executed and no live Supabase connection was made.
