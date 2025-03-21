// // src/controllers/rosterController.ts
// import { Request, Response } from 'express';
// import { dataSource } from '../db';

// export const getRoster = async (req: Request, res: Response) => {
//   try {
//     const { rows } = await dataSource.query('SELECT * FROM attendance_roster');
//     res.status(200).json(rows);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const createRoster = async (req: Request, res: Response) => {
//   try {
//     const { user_id, date, shift } = req.body;
//     const { rows } = await dataSource.query(
//       'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
//       [user_id, date, shift]
//     );
//     res.status(201).json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const updateRoster = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { user_id, date, shift } = req.body;
//     const { rows } = await dataSource.query(
//       'UPDATE attendance_roster SET user_id = $1, date = $2, shift = $3 WHERE id = $4 RETURNING *',
//       [user_id, date, shift, id]
//     );
//     if (rows.length === 0) {
//       res.status(404).json({ message: 'Roster entry not found' });
//     } else {
//       res.status(200).json(rows[0]);
//     }
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const deleteRoster = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { rowCount } = await dataSource.query('DELETE FROM attendance_roster WHERE id = $1', [id]);
//     if (rowCount === 0) {
//       res.status(404).json({ message: 'Roster entry not found' });
//     } else {
//       res.status(204).send();
//     }
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const bulkCreateRoster = async (req: Request, res: Response) => {
//   const rosterEntries: { user_id: number; date: string; shift: string }[] = req.body;
//   const queryRunner = dataSource.createQueryRunner();

//   try {
//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     const results = await Promise.all(
//       rosterEntries.map(async (entry) => {
//         const result = await queryRunner.manager.query(
//           'INSERT INTO attendance_roster (user_id, date, shift) VALUES ($1, $2, $3) RETURNING *',
//           [entry.user_id, entry.date, entry.shift]
//         );
//         return result[0];
//       })
//     );

//     await queryRunner.commitTransaction();
//     res.status(201).json(results);
//   } catch (error) {
//     await queryRunner.rollbackTransaction();
//     res.status(500).json({ error: (error as Error).message });
//   } finally {
//     await queryRunner.release();
//   }
// };

// export const getAssignedRosters = async (req: Request, res: Response) => {
//   try {
//     const { rows } = await dataSource.query(
//       'SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id'
//     );
//     res.status(200).json(rows);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// export const exportRoster = async (req: Request, res: Response) => {
//   try {
//     const { rows } = await dataSource.query(
//       'SELECT r.*, u.name as user_name FROM attendance_roster r JOIN attendance_attendance_users u ON r.user_id = u.id'
//     );
//     res.status(200).json({ message: 'Roster exported successfully', data: rows });
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };
