# Prisma Migrations

This directory contains the Prisma migration history.

## Running Migrations

To generate a new migration (requires DATABASE_URL env variable set to a running Postgres instance):

```
npm run prisma:migrate:dev
```

For development without a running database, use:

```
npm run prisma:push
```
