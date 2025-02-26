import cron from 'node-cron';
import { deleteBundle } from './bundleManager';
import { dataSource } from "./db";

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
  // Ensure the data source is initialized
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  
  const query = `
      SELECT bundle_name
      FROM bundles
      WHERE expiration_date < NOW()
  `;
  const result = await dataSource.query(query);
  return result.map((row: { bundle_name: string }) => row.bundle_name);
}
