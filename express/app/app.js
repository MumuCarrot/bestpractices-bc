import express from 'express';
import cookieParser from 'cookie-parser';
import healthRouter from './routers/health.router.js';
import { serverConfig } from './config/index.js';

const app = express();
const port = serverConfig.port;

app.use(express.json());
app.use(cookieParser());
app.use('/health', healthRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});