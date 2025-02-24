import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import uWS from 'uWebSockets.js';

interface AuthRequest extends uWS.HttpRequest {
  device?: { deviceId: string };
}

const login = async (res: uWS.HttpResponse, req: uWS.HttpRequest) => {
  let buffer: Buffer[] = [];
  res.onData((ab, isLast) => {
    buffer.push(Buffer.from(ab));
    if (isLast) {
      const body = Buffer.concat(buffer).toString();
      const { username, password } = JSON.parse(body);
      (async () => {
        try {
          const { rows } = await pool.query('SELECT * FROM devices WHERE username = $1', [username]);
          if (rows.length === 0) {
            res.writeStatus('401 Unauthorized').end(JSON.stringify({ message: 'Invalid credentials' }));
            return;
          }
          const device = rows[0];
          const isValid = await bcrypt.compare(password, device.password);
          if (!isValid) {
            res.writeStatus('401 Unauthorized').end(JSON.stringify({ message: 'Invalid credentials' }));
            return;
          }
          const token = jwt.sign({ deviceId: device.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
          res.writeHeader('Content-Type', 'application/json').end(JSON.stringify({ success: true, message: 'Authentication successful.', token, expiresIn: 3600 }));
        } catch (error: any) {
          res.writeStatus('500 Internal Server Error').end(JSON.stringify({ error: error.message }));
        }
      })();
    }
  });
};

const renewToken = async (res: uWS.HttpResponse, req: AuthRequest) => {
  const { deviceId } = req.device!;
  try {
    const token = jwt.sign({ deviceId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.writeHeader('Content-Type', 'application/json').end(JSON.stringify({ success: true, message: 'Token renewed successfully.', newToken: token, expiresIn: 3600 }));
  } catch (error) {
    res.writeStatus('401 Unauthorized').end(JSON.stringify({ message: 'Token renewal failed' }));
  }
};

const app = uWS.App();

app.post('/login', login);
app.post('/renewToken', renewToken);

app.listen(3000, (token) => {
  if (token) {
    console.log('Listening to port 3000');
  } else {
    console.log('Failed to listen to port 3000');
  }
});
