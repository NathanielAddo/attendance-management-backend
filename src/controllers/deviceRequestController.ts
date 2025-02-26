// import { App } from 'uWebSockets.js';
// import { pool } from '../db.js';

// interface CustomRequest {
//   user: {
//     id: string;
//   };
//   body: any;
//   query: any;
//   params: any;
// }

// const submitDeviceRequest = async (res: any, req: CustomRequest) => {
//   const { deviceInfo } = req.body;
//   const userId = req.user.id;

//   try {
//     const { rows } = await pool.query(
//       'INSERT INTO attendance_device_requests (user_id, device_info, status) VALUES ($1, $2, $3) RETURNING *',
//       [userId, JSON.stringify(deviceInfo), 'pending']
//     );

//     res.writeStatus('201 Created').end(JSON.stringify({
//       message: 'Device approval request submitted successfully.',
//       requestId: rows[0].id,
//       status: rows[0].status,
//       submittedAt: rows[0].created_at
//     }));
//   } catch (error: any) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
//   }
// };

// const getDeviceRequestStatus = async (res: any, req: CustomRequest) => {
//   const userId = req.user.id;
//   const { requestId } = req.query;

//   try {
//     let query = 'SELECT * FROM attendance_device_requests WHERE user_id = $1';
//     const values: (string | number)[] = [userId];
//     if (requestId) {
//       query += ' AND id = $2';
//       values.push(Number(requestId));
//     }
//     const { rows } = await pool.query(query, values);
//     if (rows.length === 0) {
//       res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Request not found' }));
//       return;
//     }
//     const requests = rows.map(row => {
//       const deviceInfo = JSON.parse(row.device_info);
//       return {
//         requestId: row.id,
//         deviceId: deviceInfo.deviceId,
//         deviceName: deviceInfo.deviceName,
//         status: row.status,
//         submittedAt: row.created_at,
//         approvedAt: row.approved_at,
//         rejectedAt: row.rejected_at,
//         reviewedBy: row.reviewed_by
//       };
//     });
//     res.end(JSON.stringify(requests));
//   } catch (error: any) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
//   }
// };

// const cancelDeviceRequest = async (res: any, req: CustomRequest) => {
//   const { requestId } = req.params;
//   const userId = req.user.id;

//   try {
//     const { rows } = await pool.query(
//       'DELETE FROM attendance_device_requests WHERE id = $1 AND user_id = $2 AND status = $3 RETURNING *',
//       [requestId, userId, 'pending']
//     );
//     if (rows.length === 0) {
//       res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Request not found or cannot be canceled' }));
//       return;
//     }
//     res.end(JSON.stringify({ message: 'Device approval request canceled successfully.', requestId: rows[0].id }));
//   } catch (error: any) {
//     res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
//   }
// };

// const app = App();

// app.post('/submitDeviceRequest', (res, req) => {
//   let body = '';
//   req.onData((chunk, isLast) => {
//     body += Buffer.from(chunk).toString();
//     if (isLast) {
//       req.body = JSON.parse(body);
//       submitDeviceRequest(res, req);
//     }
//   });
// });

// app.get('/getDeviceRequestStatus', (res, req) => {
//   req.query = {}; // Parse query parameters from URL
//   getDeviceRequestStatus(res, req);
// });

// app.del('/cancelDeviceRequest/:requestId', (res, req) => {
//   req.params = { requestId: req.getParameter(0) };
//   cancelDeviceRequest(res, req);
// });

// app.listen(3000, (token) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
