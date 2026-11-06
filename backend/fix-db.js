const { Client } = require('pg');
require('dotenv').config();

const fixDatabase = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to DB:", (await client.query('SELECT current_database()')).rows[0].current_database);

    // Force the column into the properties table
    await client.query('ALTER TABLE properties ADD COLUMN IF NOT EXISTS main_image TEXT;');
    console.log("✅ SUCCESS: main_image column added!");
    
    // Verify it's there
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'properties' AND column_name = 'main_image';
    `);
    
    if (res.rows.length > 0) {
      console.log("✅ VERIFIED: main_image exists in the table!");
    } else {
      console.log("❌ FAILED: main_image not found.");
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
  }
};

fixDatabase();