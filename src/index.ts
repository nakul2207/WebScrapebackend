import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import Mainrouter from './routes/main';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', Mainrouter);

app.get('/', (_req, res) => {
  res.send('Hello TypeScript with Express!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
