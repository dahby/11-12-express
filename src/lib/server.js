'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import foodRoutes from '../route/food-router';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

app.use(foodRoutes);
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER: Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});
app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `SERVER: Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'SERVER: Server is off');
      });
    });
};

export { startServer, stopServer };
