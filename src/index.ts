import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import Mainrouter from './routes/main';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', Mainrouter);

app.get('/', (_req, res) => {
  res.send('Hello TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});