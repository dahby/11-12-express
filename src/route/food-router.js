'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Food from '../model/food';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const foodRouter = new Router();

foodRouter.post('/api/food', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'FOOD-ROUTER: POST - processing a request');
  if (!request.body.name) {
    logger.log(logger.INFO, 'FOOD-ROUTER: POST - Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Food(request.body).save()
    .then((food) => {
      logger.log(logger.INFO, 'FOOD-ROUTER: POST - Responding with a 200 status code');
      return response.json(food);
    })
    .catch((error) => {
      logger.log(logger.ERROR, 'FOOD-Router: __POST_ERROR__');
      logger.log(logger.ERROR, `FOOD-ROUTER: ${error}`);
      return response.sendStatus(500);
    });
});

foodRouter.get('/api/food/:id', (request, response) => {
  logger.log(logger.INFO, 'FOOD-ROUTER: GET - Processing a request');

  return Food.findById(request.params.id)
    .then((food) => {
      if (!food) {
        logger.log(logger.info, 'FOOD-ROUTER: GET - Responding with a 404 status code - (!note)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'FOOD-ROUTER: GET - Responding with a 200 status code');
      return response.json(food);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'FOOD-ROUTER: GET - reponding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, 'FOOD-ROUTER: __GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, `FOOD-ROUTER: ${error}`);
      return response.sendStatus(500);
    });
});

export default foodRouter;
