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
let mockId = null;

describe('/api/food', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Food.remove({}));
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
        mockId = response.body._id;
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
    test('should respond w/ 404 if no id is passed', () => {
      return superagent.get(`${apiURL}`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('should respond 404 if bad id', () => {
      return superagent.get(`${apiURL}/badId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/food', () => {
    test('should respond with 204 if no errors', () => {
      return superagent.del(`${apiURL}/${mockId}`)
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body).toEqual({});
        });
    });
    test('should response with 404 if no food is found', () => {
      return superagent.del(`${apiURL}/BadID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('should response with 400 if no id', () => {
      return superagent.del(`${apiURL}`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
});
