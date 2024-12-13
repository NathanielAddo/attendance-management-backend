// import axios from 'axios';

// const SMS_API_URL = process.env.SMS_API_URL;
// const SMS_API_KEY = process.env.SMS_API_KEY;

// export async function sendSMS(phoneNumber: string, message: string): Promise<void> {
//   try {
//     await axios.post(SMS_API_URL, {
//       phoneNumber,
//       message,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${SMS_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('Error sending SMS:', error);
//     throw new Error('Failed to send SMS');
//   }
// }

