import { App } from 'uWebSockets.js';
import { pool } from '../db.js';

interface User {
  id: number;
}

interface AuthenticatedRequest {
  user?: User;
  body: any;
}

const registerVoice = async (res: any, req: AuthenticatedRequest): Promise<void> => {
  const { voiceData } = req.body;
  if (!req.user || !req.user.id) {
    res.writeStatus('401 Unauthorized').end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_biometric_data (user_id, voice_data) VALUES ($1, $2) RETURNING *',
      [userId, voiceData]
    );
    res.writeStatus('201 Created').end(JSON.stringify({ message: 'Voice registered successfully.', voiceId: rows[0].id, uploadedAt: rows[0].created_at }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
  }
};

const registerImage = async (res: any, req: AuthenticatedRequest): Promise<void> => {
  const { imageData } = req.body;
  if (!req.user || !req.user.id) {
    res.writeStatus('401 Unauthorized').end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'INSERT INTO attendance_biometric_data (user_id, image_data) VALUES ($1, $2) RETURNING *',
      [userId, imageData]
    );
    res.writeStatus('201 Created').end(JSON.stringify({ message: 'Image registered successfully.', imageId: rows[0].id, uploadedAt: rows[0].created_at }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
  }
};

const updateVoice = async (res: any, req: AuthenticatedRequest): Promise<void> => {
  const { voiceData } = req.body;
  if (!req.user || !req.user.id) {
    res.writeStatus('401 Unauthorized').end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance_biometric_data SET voice_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [voiceData, userId]
    );
    if (rows.length === 0) {
      res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Voice data not found' }));
      return;
    }
    res.end(JSON.stringify({ message: 'Voice updated successfully.', voiceId: rows[0].id, updatedAt: rows[0].updated_at }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
  }
};

const updateImage = async (res: any, req: AuthenticatedRequest): Promise<void> => {
  const { imageData } = req.body;
  if (!req.user || !req.user.id) {
    res.writeStatus('401 Unauthorized').end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      'UPDATE attendance_biometric_data SET image_data = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
      [imageData, userId]
    );
    if (rows.length === 0) {
      res.writeStatus('404 Not Found').end(JSON.stringify({ message: 'Image data not found' }));
      return;
    }
    res.end(JSON.stringify({ message: 'Image updated successfully.', imageId: rows[0].id, updatedAt: rows[0].updated_at }));
  } catch (error: any) {
    res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
  }
};

const app = App();

app.post('/registerVoice', (res, req) => {
  let body = '';
  req.onData((chunk, isLast) => {
    body += Buffer.from(chunk).toString();
    if (isLast) {
      req.body = JSON.parse(body);
      registerVoice(res, req);
    }
  });
});

app.post('/registerImage', (res, req) => {
  let body = '';
  req.onData((chunk, isLast) => {
    body += Buffer.from(chunk).toString();
    if (isLast) {
      req.body = JSON.parse(body);
      registerImage(res, req);
    }
  });
});

app.put('/updateVoice', (res, req) => {
  let body = '';
  req.onData((chunk, isLast) => {
    body += Buffer.from(chunk).toString();
    if (isLast) {
      req.body = JSON.parse(body);
      updateVoice(res, req);
    }
  });
});

app.put('/updateImage', (res, req) => {
  let body = '';
  req.onData((chunk, isLast) => {
    body += Buffer.from(chunk).toString();
    if (isLast) {
      req.body = JSON.parse(body);
      updateImage(res, req);
    }
  });
});

app.listen(9001, (token) => {
  if (token) {
    console.log('Listening to port 9001');
  } else {
    console.log('Failed to listen to port 9001');
  }
});
