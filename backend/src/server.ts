import app from './app';
import { env } from './config/env';
import { checkDbConnection, pool } from './config/db';

const start = async (): Promise<void> => {
  try {
    await checkDbConnection();
    
    // Force the backend to tell us EXACTLY what database it is using
    const dbInfo = await pool.query('SELECT current_database(), current_schema()');
    console.log(`🔗 BACKEND IS CONNECTED TO DATABASE:`, dbInfo.rows[0]);

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

start();