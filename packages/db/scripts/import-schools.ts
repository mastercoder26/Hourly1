/**
 * Import US schools into `school_lookup` from a bundled JSON file.
 *
 * Usage (from repo root):
 *   npm run import:schools -w db                       # imports bundled seed
 *   npm run import:schools -w db -- /path/to/full.json # imports a custom file
 *
 * The bundled `data/schools-seed.json` is a representative set (~140 schools
 * across all 50 states + DC). To load a full national NCES / US Dept. of
 * Education export, pass its path as the first CLI argument (no API key needed)
 * using the same shape: { ncesId, name, districtName?, city?, state?, zipCode? }[].
 * The importer is idempotent: it upserts by ncesId when present, otherwise by
 * name + zipCode, so re-running it will not create duplicates.
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

type SchoolRow = {
  ncesId?: string;
  name: string;
  districtName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

async function main() {
  const prisma = new PrismaClient();
  const argPath = process.argv[2];
  const filePath = argPath
    ? path.resolve(process.cwd(), argPath)
    : path.join(__dirname, '..', 'data', 'schools-seed.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const rows = JSON.parse(raw) as SchoolRow[];

  let upserted = 0;
  for (const row of rows) {
    const ncesId = row.ncesId?.trim() || null;
    if (ncesId) {
      await prisma.schoolLookup.upsert({
        where: { ncesId },
        create: {
          ncesId,
          name: row.name,
          districtName: row.districtName ?? null,
          city: row.city ?? null,
          state: row.state ?? null,
          zipCode: row.zipCode ?? null,
        },
        update: {
          name: row.name,
          districtName: row.districtName ?? null,
          city: row.city ?? null,
          state: row.state ?? null,
          zipCode: row.zipCode ?? null,
        },
      });
    } else {
      const existing = await prisma.schoolLookup.findFirst({
        where: { name: row.name, zipCode: row.zipCode ?? undefined },
      });
      if (existing) {
        await prisma.schoolLookup.update({
          where: { id: existing.id },
          data: {
            name: row.name,
            districtName: row.districtName ?? null,
            city: row.city ?? null,
            state: row.state ?? null,
            zipCode: row.zipCode ?? null,
          },
        });
      } else {
        await prisma.schoolLookup.create({
          data: {
            name: row.name,
            districtName: row.districtName ?? null,
            city: row.city ?? null,
            state: row.state ?? null,
            zipCode: row.zipCode ?? null,
          },
        });
      }
    }
    upserted += 1;
  }

  console.log(`Imported ${upserted} schools into school_lookup`);
  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
