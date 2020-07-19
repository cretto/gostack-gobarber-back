import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { errors } from 'celebrate';
import 'express-async-errors';
import routes from './routes';
import '../../container';
import '../typeorm';
import upload from '../../../config/upload';
import AppError from '../../errors/AppError';
import rateLimiter from './middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(upload.tempFolder));
app.use(rateLimiter);

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  console.error(err);
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('Server Started o port 3333');
});
