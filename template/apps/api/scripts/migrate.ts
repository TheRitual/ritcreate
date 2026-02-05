import pg from "pg";
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  const client = new pg.Client({ connectionString });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  const migrationsDir = join(__dirname, "..", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const version = file.replace(/\.sql$/, "");
    const { rows } = await client.query(
      "SELECT 1 FROM schema_migrations WHERE version = $1",
      [version]
    );
    if (rows.length > 0) continue;

    const sql = await readFile(join(migrationsDir, file), "utf8");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [
      version,
    ]);
    console.log(`Applied ${version}`);
  }

  await client.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
