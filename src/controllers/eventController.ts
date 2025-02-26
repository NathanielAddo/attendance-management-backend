// import uWS from 'uWebSockets.js';
// import { pool } from '../db.js';

// interface Event {
//   name: string;
//   start_time: string;
//   end_time: string;
//   date: string;
//   country: string;
//   branch: string;
// }

// const app = uWS.App();

// app.get('/events', async (res, req) => {
//   const startDate = req.getQuery('startDate');
//   const endDate = req.getQuery('endDate');
//   const country = req.getQuery('country');
//   const branch = req.getQuery('branch');

//   try {
//     let query = 'SELECT * FROM attendance_events WHERE 1=1';
//     const values: (string | undefined)[] = [];
//     let valueIndex = 1;

//     if (startDate && endDate) {
//       query += ` AND date BETWEEN $${valueIndex++} AND $${valueIndex++}`;
//       values.push(startDate, endDate);
//     }
//     if (country) {
//       query += ` AND country = $${valueIndex++}`;
//       values.push(country);
//     }
//     if (branch) {
//       query += ` AND branch = $${valueIndex++}`;
//       values.push(branch);
//     }

//     const { rows } = await pool.query(query, values);
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(rows));
//   } catch (error) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//   }
// });

// app.post('/events', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { name, start_time, end_time, date, country, branch } = JSON.parse(buffer) as Event;
//       pool.query(
//         'INSERT INTO attendance_events (name, start_time, end_time, date, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//         [name, start_time, end_time, date, country, branch]
//       )
//         .then(({ rows }) => {
//           res.writeHeader('Content-Type', 'application/json');
//           res.writeStatus('201 Created').end(JSON.stringify(rows[0]));
//         })
//         .catch((error) => {
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//         });
//     }
//   });
// });

// app.put('/events/:id', async (res, req) => {
//   const id = req.getParameter(0);
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { name, start_time, end_time, date, country, branch } = JSON.parse(buffer) as Event;
//       pool.query(
//         'UPDATE attendance_events SET name = $1, start_time = $2, end_time = $3, date = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
//         [name, start_time, end_time, date, country, branch, id]
//       )
//         .then(({ rows }) => {
//           if (rows.length === 0) {
//             res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Event not found' }));
//             return;
//           }
//           res.writeHeader('Content-Type', 'application/json');
//           res.end(JSON.stringify(rows[0]));
//         })
//         .catch((error) => {
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//         });
//     }
//   });
// });

// app.del('/events/:id', async (res, req) => {
//   const id = req.getParameter(0);
//   pool.query('DELETE FROM attendance_events WHERE id = $1', [id])
//     .then(({ rowCount }) => {
//       if (rowCount === 0) {
//         res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Event not found' }));
//         return;
//       }
//       res.writeStatus('204 No Content').end();
//     })
//     .catch((error) => {
//       res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//     });
// });

// app.post('/events/bulk', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const events = JSON.parse(buffer) as Event[];
//       if (!Array.isArray(events)) {
//         res.writeStatus('400 Bad Request').end(JSON.stringify({ error: 'Invalid input, expected an array of events' }));
//         return;
//       }
//       pool.connect()
//         .then(async (client) => {
//           try {
//             await client.query('BEGIN');
//             const createdEvents: Event[] = [];
//             for (const event of events) {
//               const { rows } = await client.query(
//                 'INSERT INTO attendance_events (name, start_time, end_time, date, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//                 [event.name, event.start_time, event.end_time, event.date, event.country, event.branch]
//               );
//               createdEvents.push(rows[0]);
//             }
//             await client.query('COMMIT');
//             res.writeHeader('Content-Type', 'application/json');
//             res.writeStatus('201 Created').end(JSON.stringify(createdEvents));
//           } catch (error) {
//             await client.query('ROLLBACK');
//             res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//           } finally {
//             client.release();
//           }
//         })
//         .catch((error) => {
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: (error as Error).message }));
//         });
//     }
//   });
// });

// app.listen(3000, (token) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
