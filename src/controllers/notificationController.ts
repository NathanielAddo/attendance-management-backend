// import { App } from 'uWebSockets.js';
// import { pool } from '../db';
// import nodemailer from 'nodemailer';
// // import { sendSMS } from '../utils/smsService';

// // Define the interface for a notification
// interface Notification {
//   id: number;
//   template_id: number;
//   medium: string;
//   alert_type: string;
//   status: string;
//   start_date: string; // Assuming date is stored as string
//   delivery_time: string; // Assuming time is stored as string
//   additional_text: string;
//   recurring_status: string;
//   user_type: string;
// }

// // Function to get all notifications
// const getNotifications = async (res: any): Promise<void> => {
//   try {
//     const { rows }: { rows: Notification[] } = await pool.query('SELECT * FROM attendance_notifications');

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
// };

// // Function to create a new notification
// const createNotification = async (res: any, req: any): Promise<void> => {
//   let body = '';
//   req.onData((chunk: ArrayBuffer, isLast: boolean) => {
//     body += Buffer.from(chunk).toString();
//     if (isLast) {
//       const {
//         template_id,
//         medium,
//         alert_type,
//         status,
//         start_date,
//         delivery_time,
//         additional_text,
//         recurring_status,
//         user_type,
//       } = JSON.parse(body);

//       pool.query(
//         `
//         INSERT INTO attendance_notifications 
//         (template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type) 
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
//         RETURNING *
//         `,
//         [template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type]
//       ).then(({ rows }: { rows: Notification[] }) => {
//         res.writeStatus('201 Created').end(JSON.stringify({
//           success: true,
//           message: 'Notification created successfully',
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
// };

// const updateNotification = async (res: any, req: any): Promise<void> => {
//   const id = req.getParameter(0);
//   let body = '';
//   req.onData((chunk: ArrayBuffer, isLast: boolean) => {
//     body += Buffer.from(chunk).toString();
//     if (isLast) {
//       const {
//         template_id,
//         medium,
//         alert_type,
//         status,
//         start_date,
//         delivery_time,
//         additional_text,
//         recurring_status,
//         user_type,
//       } = JSON.parse(body);

//       pool.query(
//         `
//         UPDATE attendance_notifications 
//         SET template_id = $1, medium = $2, alert_type = $3, status = $4, start_date = $5, 
//             delivery_time = $6, additional_text = $7, recurring_status = $8, user_type = $9 
//         WHERE id = $10 
//         RETURNING *
//         `,
//         [
//           template_id,
//           medium,
//           alert_type,
//           status,
//           start_date,
//           delivery_time,
//           additional_text,
//           recurring_status,
//           user_type,
//           id,
//         ]
//       ).then(({ rows }: { rows: Notification[] }) => {
//         if (rows.length === 0) {
//           res.writeStatus('404 Not Found').end(JSON.stringify({
//             success: false,
//             message: 'Notification not found',
//           }));
//         } else {
//           res.end(JSON.stringify({
//             success: true,
//             message: 'Notification updated successfully',
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
// };

// const deleteNotification = async (res: any, req: any): Promise<void> => {
//   const id = req.getParameter(0);

//   try {
//     const result = await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
//     const rowCount: number = result.rowCount ?? 0; // Handle potential null values safely

//     if (rowCount === 0) {
//       res.writeStatus('404 Not Found').end(JSON.stringify({
//         success: false,
//         message: 'Notification not found',
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
// };

// // Configure email transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendNotification = async (res: any, req: any): Promise<void> => {
//   let body = '';
//   req.onData((chunk: ArrayBuffer, isLast: boolean) => {
//     body += Buffer.from(chunk).toString();
//     if (isLast) {
//       const { message, medium, userIds } = JSON.parse(body);

//       pool.query('SELECT id, email, phone FROM users WHERE id = ANY($1)', [userIds])
//         .then(({ rows: users }) => {
//           if (medium === 'Email') {
//             // Send email notifications
//             for (const user of users) {
//               transporter.sendMail({
//                 from: process.env.GMAIL_USER,
//                 to: user.email,
//                 subject: 'Notification',
//                 text: message,
//               });
//             }
//           } else if (medium === 'SMS') {
//             // Send SMS notifications using custom API
//             // for (const user of users) {
//             //   await sendSMS(user.phone, message);
//             // }
//           } else if (medium === 'Push') {
//             // Placeholder for push notification logic
//             console.log(`Sending push notification to users:`, userIds);
//             console.log('Message:', message);
//           }

//           res.end(JSON.stringify({
//             success: true,
//             message: 'Notifications sent successfully',
//           }));
//         }).catch((error: any) => {
//           res.writeStatus('500 Internal Server Error').end(JSON.stringify({
//             success: false,
//             error: error.message,
//           }));
//         });
//     }
//   });
// };

// // Create uWebSocket.js app
// const app = App();

// app.get('/notifications', (res, req) => getNotifications(res));
// app.post('/notifications', (res, req) => createNotification(res, req));
// app.put('/notifications/:id', (res, req) => updateNotification(res, req));
// app.del('/notifications/:id', (res, req) => deleteNotification(res, req));
// app.post('/send-notification', (res, req) => sendNotification(res, req));

// app.listen(3000, (token) => {
//   if (token) {
//     console.log('Listening to port 3000');
//   } else {
//     console.log('Failed to listen to port 3000');
//   }
// });
