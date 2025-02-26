// import { App } from 'uWebSockets.js';
// import * as attendanceStatsController from '../controllers/attendanceStatsController.js';
// import { authenticate } from '../middlewares/auth.middleware';

// const app = App();

// app.get('/summary', (res, req) => {
//     authenticate(req, res, () => attendanceStatsController.getAttendanceSummary(req, res));
// });

// app.get('/chart-data', (res, req) => {
//     authenticate(req, res, () => attendanceStatsController.getChartData(req, res));
// });

// app.get('/table-data', (res, req) => {
//     authenticate(req, res, () => attendanceStatsController.getTableData(req, res));
// });

// app.get('/export', (res, req) => {
//     authenticate(req, res, () => attendanceStatsController.exportAttendanceData(req, res));
// });

// app.listen(3000, (token) => {
//     if (token) {
//         console.log('Listening to port 3000');
//     } else {
//         console.log('Failed to listen to port 3000');
//     }
// });
