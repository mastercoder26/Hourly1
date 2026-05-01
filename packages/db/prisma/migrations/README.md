# Prisma Migrations

This directory contains the Prisma migration history.

## Applying existing migrations (CI / production / fresh clone)

With `DATABASE_URL` set (e.g. in `packages/db/.env`):

```
npm run prisma:migrate:deploy -w db
```

## Creating a new migration (local dev)

Requires `DATABASE_URL` pointing at a running Postgres instance:

```
npm run prisma:migrate:dev -w db
```

For schema experiments without migration files (not recommended for shared envs):

```
npm run prisma:push -w db
```

## Dev data

Optional one-time seed (verified org + sample shifts if `opportunities` is empty):

```
cd packages/db && npx prisma db seed --schema prisma/schema.prisma
```
