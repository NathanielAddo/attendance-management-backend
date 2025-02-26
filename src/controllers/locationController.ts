// import { App } from 'uWebSockets.js';
// import { pool } from '../db';

// interface Location {
//   id: number;
//   name: string;
//   address: string;
//   coordinates: string;
//   radius: number;
//   country: string;
//   branch: string;
// }

// const app = App();

// app.get('/locations', async (res, req) => {
//   try {
//     const { rows }: { rows: Location[] } = await pool.query('SELECT * FROM attendance_locations');
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify({
//       success: true,
//       data: rows,
//     }));
//   } catch (error: any) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({
//       success: false,
//       error: error.message,
//     }));
//   }
// });

// app.post('/locations', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { name, address, coordinates, radius, country, branch } = JSON.parse(buffer);
//       pool.query(
//         'INSERT INTO attendance_locations (name, address, coordinates, radius, country, branch) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//         [name, address, coordinates, radius, country, branch]
//       ).then(({ rows }: { rows: Location[] }) => {
//         res.writeHeader('Content-Type', 'application/json');
//         res.writeStatus('201 Created').end(JSON.stringify({
//           success: true,
//           message: 'Location created successfully',
//           data: rows[0],
//         }));
//       }).catch((error: any) => {
//         res.writeStatus('500 Internal Server Error').end(JSON.stringify({
//           success: false,
//           error: error.message,
//         }));
//       });
//     }
//   });
// });

// app.put('/locations/:id', async (res, req) => {
//   let buffer = '';
//   res.onData((chunk, isLast) => {
//     buffer += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { id } = req.getParameter(0);
//       const { name, address, coordinates, radius, country, branch } = JSON.parse(buffer);
//       pool.query(
//         'UPDATE attendance_locations SET name = $1, address = $2, coordinates = $3, radius = $4, country = $5, branch = $6 WHERE id = $7 RETURNING *',
//         [name, address, coordinates, radius, country, branch, id]
//       ).then(({ rows }: { rows: Location[] }) => {
//         if (rows.length === 0) {
//           res.writeStatus('404 Not Found').end(JSON.stringify({
//             success: false,
//             message: 'Location not found',
//           }));
//         } else {
//           res.writeHeader('Content-Type', 'application/json');
//           res.end(JSON.stringify({
//             success: true,
//             message: 'Location updated successfully',
//             data: rows[0],
//           }));
//         }
//       }).catch((error: any) => {
//         res.writeStatus('500 Internal Server Error').end(JSON.stringify({
//           success: false,
//           error: error.message,
//         }));
//       });
//     }
//   });
// });

// app.del('/locations/:id', async (res, req) => {
//   const { id } = req.getParameter(0);
//   try {
//     const result = await pool.query('DELETE FROM attendance_locations WHERE id = $1', [id]);
//     const rowCount: number = result.rowCount ?? 0;

//     if (rowCount === 0) {
//       res.writeStatus('404 Not Found').end(JSON.stringify({
//         success: false,
//         message: 'Location not found',
//       }));
//     } else {
//       res.writeStatus('204 No Content').end();
//     }
//   } catch (error: any) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({
//       success: false,
//       error: error.message,
//     }));
//   }
// });

// app.listen(3000, (token) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
