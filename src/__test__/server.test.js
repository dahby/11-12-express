'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Food from '../model/food';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/food`;

const createFoodMock = () => {
  return new Food({
    name: faker.lorem.words(2),
    recipe: faker.lorem.words(15),
  }).save();
};

describe('/api/food', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  // afterEach(() => Food.remove({}));
  test('POST - Should respond with 200 status', () => {
    const foodToPost = {
      name: faker.lorem.words(2),
      recipe: faker.lorem.words(15),
    };
    return superagent.post(apiURL)
      .send(foodToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(foodToPost.name);
        expect(response.body.recipe).toEqual(foodToPost.recipe);
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - Should respond with 400 status', () => {
    const foodToPost = {
      recipe: faker.lorem.words(15),
    };
    return superagent.post(apiURL)
      .send(foodToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/food', () => {
    test('should respond with 200 if there are no errors', () => {
      let foodToTest = null;
      return createFoodMock()
        .then((food) => {
          foodToTest = food;
          return superagent.get(`${apiURL}/${food._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(foodToTest.name);
          expect(response.body.recipe).toEqual(foodToTest.recipe);
        });
    });
    test('should respond w/ 404 if no note is found', () => {
      return superagent.get(`${apiURL}/BadID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
