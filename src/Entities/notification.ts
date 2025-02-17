// notification.ts

// Define the Notification entity interface
export interface Notification {
    id: number;                // Unique identifier for the notification
    template_id: number;       // Template ID used for the notification
    medium: string;            // Notification medium (e.g., 'SMS', 'Email', 'Push')
    alert_type: string;        // Type of alert (e.g., 'Warning', 'Info', etc.)
    status: string;            // Status of the notification (e.g., 'Active', 'Inactive')
    start_date: string;        // Start date of the notification (in string format, could be Date)
    delivery_time: string;     // Time when the notification is to be delivered (in string format, could be Date)
    additional_text: string;   // Additional text or content related to the notification
    recurring_status: string;  // Whether the notification is recurring or not
    user_type: string;         // Type of user the notification is intended for (e.g., 'Admin', 'User')
  }
  
  // Define the Request body interface for creating and updating notifications
  export interface CreateUpdateNotificationRequest {
    template_id: number;
    medium: string;
    alert_type: string;
    status: string;
    start_date: string;
    delivery_time: string;
    additional_text: string;
    recurring_status: string;
    user_type: string;
  }
  