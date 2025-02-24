import { App } from 'uws';
import { pool } from '../db';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { getAttendanceSummaryQuery, getChartDataQuery, getTableDataQuery } from '../utils/sqlQueries';

interface QueryParams {
  dateInterval?: string;
  schedule?: string;
  country?: string;
  region?: string;
  branch?: string;
  category?: string;
  group?: string;
  subgroup?: string;
}

const getAttendanceSummary = async (res, query: QueryParams): Promise<void> => {
  try {
    const { dateInterval, schedule, country, region, branch, category, group, subgroup } = query;
    const date = new Date(dateInterval || Date.now());

    const { rows } = await pool.query(getAttendanceSummaryQuery, [
      date,
      schedule || null,
      country || null,
      branch || null,
      category || null,
      group || null,
      subgroup || null
    ]);

    res.writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows[0]));
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ message: 'Error fetching attendance summary' }));
  }
};

const getChartData = async (res, query: { startDate: string; endDate: string }): Promise<void> => {
  try {
    const { startDate, endDate } = query;
    const { rows } = await pool.query(getChartDataQuery, [startDate, endDate]);
    res.writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ message: 'Error fetching chart data' }));
  }
};

const getTableData = async (res): Promise<void> => {
  try {
    const { rows } = await pool.query(getTableDataQuery);
    res.writeHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(rows));
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ message: 'Error fetching table data' }));
  }
};

const exportAttendanceData = async (res, query: { startDate: string; endDate: string }): Promise<void> => {
  try {
    const { startDate, endDate } = query;
    const { rows } = await pool.query(getChartDataQuery, [startDate, endDate]);

    const csvWriter = createObjectCsvWriter({
      path: path.resolve(__dirname, '../exports/attendance_stats.csv'),
      header: [
        { id: 'date', title: 'Date' },
        { id: 'total_employees', title: 'Total Employees' },
        { id: 'on_time', title: 'Present Employees' },
        { id: 'absent', title: 'Absent Employees' },
        { id: 'late_arrivals', title: 'Late Employees' },
        { id: 'early_departures', title: 'Early Departures' },
        { id: 'overtime_employees', title: 'Overtime Employees' },
        { id: 'total_hours', title: 'Total Hours' },
        { id: 'overtime_hours', title: 'Overtime Hours' },
      ]
    });

    await csvWriter.writeRecords(rows.map(stat => ({
      date: stat.date.toISOString().split('T')[0],
      total_employees: stat.total_employees,
      on_time: stat.on_time,
      absent: stat.absent,
      late_arrivals: stat.late_arrivals,
      early_departures: stat.early_departures,
      overtime_employees: stat.overtime_employees,
      total_hours: parseFloat(stat.total_hours).toFixed(2),
      overtime_hours: parseFloat(stat.overtime_hours).toFixed(2),
    })));

    res.writeHeader('Content-Type', 'application/octet-stream');
    res.end(path.resolve(__dirname, '../exports/attendance_stats.csv'));
  } catch (error) {
    console.error('Error exporting attendance data:', error);
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ message: 'Error exporting attendance data' }));
  }
};

const app = App();

app.get('/attendance-summary', (res, req) => {
  const query = req.getQuery();
  getAttendanceSummary(res, query);
});

app.get('/chart-data', (res, req) => {
  const query = req.getQuery();
  getChartData(res, query);
});

app.get('/table-data', (res, req) => {
  getTableData(res);
});

app.get('/export-attendance-data', (res, req) => {
  const query = req.getQuery();
  exportAttendanceData(res, query);
});

app.listen(3000, (token) => {
  if (token) {
    console.log('Listening to port 3000');
  } else {
    console.log('Failed to listen to port 3000');
  }
});
