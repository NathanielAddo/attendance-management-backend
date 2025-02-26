// import { App } from 'uWebSockets.js';
// import { authenticate } from '../middlewares/auth.middleware';
// import * as historyReportController from '../controllers/historyReportController.js';

// const app = App();

// app.get('/summary', (res, req) => {
//     authenticate(req, res, () => historyReportController.getSummaryReport(req, res));
// });

// app.get('/breakdown', (res, req) => {
//     authenticate(req, res, () => historyReportController.getBreakdownReport(req, res));
// });

// app.post('/validate', (res, req) => {
//     authenticate(req, res, () => historyReportController.validateUsers(req, res));
// });

// app.get('/download/summary', (res, req) => {
//     authenticate(req, res, () => historyReportController.downloadSummaryReport(req, res));
// });

// app.get('/download/breakdown', (res, req) => {
//     authenticate(req, res, () => historyReportController.downloadBreakdownReport(req, res));
// });
