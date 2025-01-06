export const getAttendanceSummaryQuery = `
  SELECT 
    COUNT(DISTINCT a.user_id) as total_employees,
    COUNT(CASE WHEN a.status = 'On Time' THEN 1 END) as on_time,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_arrivals,
    COUNT(CASE WHEN a.status = 'Early Departure' THEN 1 END) as early_departures,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
    SUM(EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600) as total_hours,
    SUM(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 - 8 ELSE 0 END) as overtime_hours,
    COUNT(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN 1 END) as overtime_employees
  FROM attendance_attendance a
  JOIN attendance_attendance_users u ON a.user_id = u.id
  JOIN attendance_attendance_schedules s ON a.schedule_id = s.id
  WHERE a.date = $1
    AND ($2::varchar IS NULL OR s.name = $2)
    AND ($3::varchar IS NULL OR u.country = $3)
    AND ($4::varchar IS NULL OR u.branch = $4)
    AND ($5::varchar IS NULL OR u.category = $5)
    AND ($6::varchar IS NULL OR u.group_name = $6)
    AND ($7::varchar IS NULL OR u.subgroup = $7)
`;

export const getChartDataQuery = `
  SELECT 
    a.date,
    COUNT(DISTINCT a.user_id) as total_employees,
    COUNT(CASE WHEN a.status = 'On Time' THEN 1 END) as on_time,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_arrivals,
    COUNT(CASE WHEN a.status = 'Early Departure' THEN 1 END) as early_departures,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
    SUM(EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600) as total_hours,
    SUM(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 - 8 ELSE 0 END) as overtime_hours,
    COUNT(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN 1 END) as overtime_employees
  FROM attendance_attendance a
  WHERE a.date BETWEEN $1 AND $2
  GROUP BY a.date
  ORDER BY a.date ASC
`;

export const getTableDataQuery = `
  SELECT 
    a.date,
    COUNT(DISTINCT a.user_id) as total_employees,
    COUNT(CASE WHEN a.status = 'On Time' THEN 1 END) as on_time,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_arrivals,
    COUNT(CASE WHEN a.status = 'Early Departure' THEN 1 END) as early_departures,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent,
    SUM(EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600) as total_hours,
    SUM(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 - 8 ELSE 0 END) as overtime_hours,
    COUNT(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN 1 END) as overtime_employees
  FROM attendance_attendance a
  GROUP BY a.date
  ORDER BY a.date DESC
  LIMIT 8
`;

