export const getSummaryReportQuery = `
  SELECT 
    u.id, u.name, u.role as "userType", u.country, u.branch, u.category, u.group_name, u.subgroup,
    s.name as schedule,
    COUNT(CASE WHEN a.clock_in_time IS NOT NULL THEN 1 END) as "clockIns",
    COUNT(CASE WHEN a.clock_out_time IS NOT NULL THEN 1 END) as "clockOuts",
    COUNT(CASE WHEN a.clock_in_time IS NOT NULL AND a.clocked_by = 'admin' THEN 1 END) as "adminClockIns",
    COUNT(CASE WHEN a.clock_out_time IS NOT NULL AND a.clocked_by = 'admin' THEN 1 END) as "adminClockOuts",
    SUM(EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600) as "totalHours",
    SUM(CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 - 8 ELSE 0 END) as "overtimeHours",
    SUM(CASE WHEN a.status = 'Late' THEN EXTRACT(EPOCH FROM (a.clock_in_time - s.start_time))/3600 ELSE 0 END) as "lateHours",
    0 as "breakOverstayHrs",
    SUM(CASE WHEN a.status = 'Early Departure' THEN EXTRACT(EPOCH FROM (s.closing_time - a.clock_out_time))/3600 ELSE 0 END) as "clockOutBeforeTimeHrs"
  FROM 
    users u
  LEFT JOIN 
    attendance a ON u.id = a.user_id
  LEFT JOIN 
    schedules s ON a.schedule_id = s.id
  WHERE 
    a.date BETWEEN $1 AND $2
    AND ($3::varchar IS NULL OR u.role = $3)
    AND ($4::varchar IS NULL OR u.country = $4)
    AND ($5::varchar IS NULL OR u.branch = $5)
    AND ($6::varchar IS NULL OR u.category = $6)
    AND ($7::varchar IS NULL OR u.group_name = $7)
    AND ($8::varchar IS NULL OR u.subgroup = $8)
    AND ($9::varchar IS NULL OR s.name = $9)
    AND ($10::varchar IS NULL OR u.name ILIKE $10 OR u.id::text ILIKE $10)
  GROUP BY 
    u.id, u.name, u.role, u.country, u.branch, u.category, u.group_name, u.subgroup, s.name
`;

export const getBreakdownReportQuery = `
  SELECT 
    u.id, u.name, u.role as "userType", u.country, u.branch, u.category, u.group_name, u.subgroup,
    s.name as schedule,
    a.date, a.clock_in_time, a.clock_out_time, a.clocked_by,
    EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 as hours,
    CASE WHEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 > 8 THEN EXTRACT(EPOCH FROM (a.clock_out_time - a.clock_in_time))/3600 - 8 ELSE 0 END as "overtimeHours",
    CASE WHEN a.status = 'Late' THEN EXTRACT(EPOCH FROM (a.clock_in_time - s.start_time))/3600 ELSE 0 END as "lateHours",
    0 as "breakOverstayHours",
    CASE WHEN a.status = 'Early Departure' THEN EXTRACT(EPOCH FROM (s.closing_time - a.clock_out_time))/3600 ELSE 0 END as "earlyDepartureHours"
  FROM 
    users u
  LEFT JOIN 
    attendance a ON u.id = a.user_id
  LEFT JOIN 
    schedules s ON a.schedule_id = s.id
  WHERE 
    a.date BETWEEN $1 AND $2
    AND ($3::varchar IS NULL OR u.role = $3)
    AND ($4::varchar IS NULL OR u.country = $4)
    AND ($5::varchar IS NULL OR u.branch = $5)
    AND ($6::varchar IS NULL OR u.category = $6)
    AND ($7::varchar IS NULL OR u.group_name = $7)
    AND ($8::varchar IS NULL OR u.subgroup = $8)
    AND ($9::varchar IS NULL OR s.name = $9)
    AND ($10::varchar IS NULL OR u.name ILIKE $10 OR u.id::text ILIKE $10)
  ORDER BY 
    u.id, a.date
`;

export const validateUsersQuery = `
  UPDATE users
  SET validated = true, validated_by = $1
  WHERE id = ANY($2::int[])
  RETURNING id
`;

