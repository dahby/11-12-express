'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Food from '../model/food';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const foodRouter = new Router();

foodRouter.post('/api/food', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'FOOD-ROUTER: POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'FOOD-ROUTER: POST - Responding with a 400 error code');
    return next(new HttpErrors(400, 'Name is required'));
  }
  return new Food(request.body).save()
    .then((food) => {
      logger.log(logger.INFO, 'FOOD-ROUTER: POST - Responding with a 200 status code');
      return response.json(food);
    })
    .catch(next);
});

foodRouter.get('/api/food/:id', (request, response, next) => {
  logger.log(logger.INFO, 'FOOD-ROUTER: GET - Processing a request');

  return Food.findById(request.params.id)
    .then((food) => {
      if (!food) {
        logger.log(logger.info, 'FOOD-ROUTER: GET - Responding with a 404 status code - (!food)');
        return next(new HttpErrors(404, 'Food not found'));
      }
      logger.log(logger.INFO, 'FOOD-ROUTER: GET - Responding with a 200 status code');
      return response.json(food);
    })
    .catch(next);
});


foodRouter.delete('/api/food/:id?', (request, response, next) => {
  logger.log(logger.INFO, 'FOOD-ROUTER: DELETE - Processing a request');

  if (!request.params.id) {
    logger.log(logger.INFO, 'FOOD-ROUTER: DELETE - Responding with a 400 error code (!req.params.id');
    return next(new HttpErrors(400, 'No id entered'));
  }
  Food.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'FOOD-ROUTER: DELETE - Responding with a 204 status');
      return response.sendStatus(204);
    })
    .catch(next);
  return undefined;
});

export default foodRouter;
