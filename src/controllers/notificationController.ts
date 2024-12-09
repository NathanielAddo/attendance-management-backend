import { Request, Response } from 'express';
import { pool } from '../db';
import nodemailer from 'nodemailer';
import twilio from 'twilio';


// Define the interface for a notification
interface Notification {
  id: number;
  template_id: number;
  medium: string;
  alert_type: string;
  status: string;
  start_date: string; // Assuming date is stored as string
  delivery_time: string; // Assuming time is stored as string
  additional_text: string;
  recurring_status: string;
  user_type: string;
}

// Function to get all notifications
const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows }: { rows: Notification[] } = await pool.query('SELECT * FROM notifications');

    res.json({
      success: true,
      data: rows,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};

// Function to create a new notification
const createNotification = async (req: Request, res: Response): Promise<void> => {
  const {
    template_id,
    medium,
    alert_type,
    status,
    start_date,
    delivery_time,
    additional_text,
    recurring_status,
    user_type,
  } = req.body as {
    template_id: number;
    medium: string;
    alert_type: string;
    status: string;
    start_date: string;
    delivery_time: string;
    additional_text: string;
    recurring_status: string;
    user_type: string;
  };

  try {
    const { rows }: { rows: Notification[] } = await pool.query(
      `
      INSERT INTO notifications 
      (template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *
      `,
      [template_id, medium, alert_type, status, start_date, delivery_time, additional_text, recurring_status, user_type]
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: rows[0],
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};


const updateNotification = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const {
    template_id,
    medium,
    alert_type,
    status,
    start_date,
    delivery_time,
    additional_text,
    recurring_status,
    user_type,
  } = req.body as {
    template_id: number;
    medium: string;
    alert_type: string;
    status: string;
    start_date: string;
    delivery_time: string;
    additional_text: string;
    recurring_status: string;
    user_type: string;
  };

  try {
    const { rows }: { rows: Notification[] } = await pool.query(
      `
      UPDATE notifications 
      SET template_id = $1, medium = $2, alert_type = $3, status = $4, start_date = $5, 
          delivery_time = $6, additional_text = $7, recurring_status = $8, user_type = $9 
      WHERE id = $10 
      RETURNING *
      `,
      [
        template_id,
        medium,
        alert_type,
        status,
        start_date,
        delivery_time,
        additional_text,
        recurring_status,
        user_type,
        id,
      ]
    );

    if (rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: rows[0],
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};



const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };

  try {
    const result = await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    const rowCount: number = result.rowCount ?? 0; // Handle potential null values safely

    if (rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
      return;
    }

    res.status(204).send();
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};


// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendNotification = async (req: Request, res: Response): Promise<void> => {
  const { message, medium, userIds } = req.body as {
    message: string;
    medium: 'SMS' | 'Email' | 'Push'; // Assuming these are the allowed mediums
    userIds: number[]; // Assuming user IDs are numeric
  };

  try {
    // Fetch user contact details from the database
    const { rows: users } = await pool.query('SELECT id, email, phone FROM users WHERE id = ANY($1)', [userIds]);

    if (medium === 'Email') {
      // Send email notifications
      for (const user of users) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Notification',
          text: message,
        });
      }
    } else if (medium === 'SMS') {
      // Send SMS notifications
      for (const user of users) {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone,
        });
      }
    } else if (medium === 'Push') {
      // Placeholder for push notification logic
      console.log(`Sending push notification to users:`, userIds);
      console.log('Message:', message);
    }

    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
    return;
  }
};

export {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification
};
