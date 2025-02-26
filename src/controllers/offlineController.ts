// import { App } from 'uWebSockets.js';
// import { pool } from '../db.js';

// interface Log {
//   logId: string;
//   userId: string;
//   scheduleId: string;
//   timestamp: string;
//   action: string;
//   location: object;
//   deviceInfo: object;
// }

// interface SyncedLog {
//   logId: string;
//   status: string;
// }

// interface ErrorLog {
//   logId: string;
//   error: string;
// }

// const syncOfflineData = async (res: any, req: any) => {
//   let buffer = Buffer.alloc(0);
//   req.onData((chunk: ArrayBuffer, isLast: boolean) => {
//     buffer = Buffer.concat([buffer, Buffer.from(chunk)]);
//     if (isLast) {
//       const { logs }: { logs: Log[] } = JSON.parse(buffer.toString());
//       (async () => {
//         try {
//           const client = await pool.connect();
//           try {
//             await client.query('BEGIN');
//             const syncedLogs: SyncedLog[] = [];
//             const errors: ErrorLog[] = [];

//             for (const log of logs) {
//               try {
//                 const { rows } = await client.query(
//                   'INSERT INTO attendance_attendance (user_id, schedule_id, clock_in_time, clock_out_time, location, device_info) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
//                   [log.userId, log.scheduleId, log.timestamp, log.action === 'clock-out' ? log.timestamp : null, JSON.stringify(log.location), JSON.stringify(log.deviceInfo)]
//                 );
//                 syncedLogs.push({ logId: log.logId, status: 'Synced' });
//               } catch (error) {
//                 errors.push({ logId: log.logId, error: (error as Error).message });
//               }
//             }

//             await client.query('COMMIT');
//             res.writeStatus('200 OK').end(JSON.stringify({ success: true, message: 'Offline logs synced successfully.', syncedLogs, errors }));
//           } catch (error) {
//             await client.query('ROLLBACK');
//             throw error;
//           } finally {
//             client.release();
//           }
//         } catch (error) {
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//         }
//       })();
//     }
//   });
// };

// const getSyncStatus = async (res: any) => {
//   try {
//     const { rows } = await pool.query('SELECT MAX(synced_at) as last_synced_at FROM sync_logs');
//     const pendingLogs = await pool.query('SELECT COUNT(*) as count FROM attendance_attendance WHERE synced = false');
//     res.writeStatus('200 OK').end(JSON.stringify({
//       success: true,
//       data: {
//         lastSyncedAt: rows[0].last_synced_at,
//         pendingLogs: pendingLogs.rows[0].count,
//         lastError: null // Implement logic to fetch last error if needed
//       }
//     }));
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// };

// const app = App();

// app.post('/syncOfflineData', syncOfflineData);
// app.get('/getSyncStatus', getSyncStatus);

// app.listen(3000, (token: any) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
