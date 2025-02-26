// import { App } from 'uWebSockets.js';
// import { pool } from '../db';

// const app = App();

// app.get('/roster', async (res, req) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM attendance_roster');
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(rows));
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// });

// app.post('/roster', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { user_id, date, shift } = JSON.parse(buffer);
//       pool.query(
//         'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
//         [user_id, date, shift]
//       ).then(({ rows }) => {
//         res.writeStatus('201 Created').writeHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify(rows[0]));
//       }).catch(error => {
//         res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//       });
//     }
//   });
// });

// app.put('/roster/:id', async (res, req) => {
//   let buffer = '';
//   const id = req.getParameter(0);
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { user_id, date, shift } = JSON.parse(buffer);
//       pool.query(
//         'UPDATE attendance_roster SET user_id = $1, date = $2, shift = $3 WHERE id = $4 RETURNING *',
//         [user_id, date, shift, id]
//       ).then(({ rows }) => {
//         if (rows.length === 0) {
//           res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Roster entry not found' }));
//         } else {
//           res.writeHeader('Content-Type', 'application/json');
//           res.end(JSON.stringify(rows[0]));
//         }
//       }).catch(error => {
//         res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//       });
//     }
//   });
// });

// app.del('/roster/:id', async (res, req) => {
//   const id = req.getParameter(0);
//   try {
//     const { rowCount } = await pool.query('DELETE FROM attendance_roster WHERE id = $1', [id]);
//     if (rowCount === 0) {
//       res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Roster entry not found' }));
//     } else {
//       res.writeStatus('204 No Content').end();
//     }
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// });

// app.post('/roster/bulk', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const rosterEntries: { user_id: number; date: string; shift: string }[] = JSON.parse(buffer);
//       pool.connect().then(client => {
//         client.query('BEGIN').then(() => {
//           const promises = rosterEntries.map(entry =>
//             client.query(
//               'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
//               [entry.user_id, entry.date, entry.shift]
//             )
//           );
//           Promise.all(promises).then(results => {
//             client.query('COMMIT').then(() => {
//               client.release();
//               res.writeStatus('201 Created').writeHeader('Content-Type', 'application/json');
//               res.end(JSON.stringify(results.map(result => result.rows[0])));
//             }).catch(error => {
//               client.query('ROLLBACK').then(() => {
//                 client.release();
//                 res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//               });
//             });
//           }).catch(error => {
//             client.query('ROLLBACK').then(() => {
//               client.release();
//               res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//             });
//           });
//         }).catch(error => {
//           client.release();
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//         });
//       }).catch(error => {
//         res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//       });
//     }
//   });
// });

// app.get('/assigned-rosters', async (res, req) => {
//   try {
//     const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id');
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(rows));
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// });

// app.get('/export-roster', async (res, req) => {
//   try {
//     const { rows } = await pool.query('SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id');
//     // In a real-world scenario, you would format this data for export (e.g., CSV)
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({ message: 'Roster exported successfully', data: rows }));
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// });

// app.listen(3000, (token) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
