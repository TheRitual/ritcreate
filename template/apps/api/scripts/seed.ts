import pg from "pg";

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is required");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  await client.query(
    `INSERT INTO users (email, role) VALUES ($1, 'admin') ON CONFLICT (email) DO NOTHING`,
    [adminEmail]
  );

  await client.end();
  console.log("Seed completed");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
