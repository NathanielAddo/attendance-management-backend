import cron from 'node-cron';
import { deleteBundle } from './bundleManager';
import { pool } from './db'; 

// Run cache invalidation every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const bundlesToDelete = await listExpiredBundles();
    for (const bundle of bundlesToDelete) {
      await deleteBundle(bundle);
    }
    console.log('Cache invalidation completed successfully');
  } catch (error) {
    console.error('Error during cache invalidation:', error);
  }
});

async function listExpiredBundles(): Promise<string[]> {
  const db = await pool.connect(); 
  try {
    const query = `
      SELECT bundle_name
      FROM bundles
      WHERE expiration_date < NOW()
    `;
    const result = await db.query(query);
    return result.rows.map((row: { bundle_name: string }) => row.bundle_name);
  } finally {
    db.release(); // Ensure the client is released back to the pool
  }
}
