// import uWS from 'uWebSockets.js';
// import * as adminScheduleController from '../controllers/adminScheduleController';  // Assuming the controller is exported like this

// const app = uWS.App();

// // Get all schedules
// app.get("/", async (res, req) => {
//     const result = await adminScheduleController.getAllSchedules();
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result));
// });

// // Get a specific schedule by ID
// app.get("/:id", async (res, req) => {
//     const id = req.getParameter(0);
//     const result = await adminScheduleController.getScheduleById(id);
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result));
// });

// // Create a new schedule
// app.post("/", async (res, req) => {
//     let buffer = '';
//     res.onData((chunk, isLast) => {
//         buffer += Buffer.from(chunk).toString();
//         if (isLast) {
//             const data = JSON.parse(buffer);
//             adminScheduleController.createSchedule(data).then(result => {
//                 res.writeHeader('Content-Type', 'application/json');
//                 res.end(JSON.stringify(result));
//             });
//         }
//     });
// });

// // Update a schedule by ID
// app.put("/:id", async (res, req) => {
//     const id = req.getParameter(0);
//     let buffer = '';
//     res.onData((chunk, isLast) => {
//         buffer += Buffer.from(chunk).toString();
//         if (isLast) {
//             const data = JSON.parse(buffer);
//             adminScheduleController.updateSchedule(id, data).then(result => {
//                 res.writeHeader('Content-Type', 'application/json');
//                 res.end(JSON.stringify(result));
//             });
//         }
//     });
// });

// // Delete a schedule by ID
// app.del("/:id", async (res, req) => {
//     const id = req.getParameter(0);
//     const result = await adminScheduleController.deleteSchedule(id);
//     res.writeHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result));
// });
