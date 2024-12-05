import cron from 'node-cron';
import { createAndUploadBundle } from './bundleManager';

const frequentQueries = [
  { name: 'daily_active_users', query: 'SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE date = CURRENT_DATE' },
  { name: 'top_products', query: 'SELECT product_id, SUM(quantity) as total_sold FROM orders GROUP BY product_id ORDER BY total_sold DESC LIMIT 10' },
  // Add more frequent queries here
];

// Run precomputation every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  for (const { name, query } of frequentQueries) {
    try {
      await createAndUploadBundle(name, query);
      console.log(`Precomputed bundle for ${name}`);
    } catch (error) {
      console.error(`Error precomputing bundle for ${name}:`, error);
    }
  }
});

