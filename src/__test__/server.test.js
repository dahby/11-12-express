'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Food from '../model/food';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/food`;

// const createFoodMock = () => {
//   return new Food({
//     name: faker.lorem.words(2),
//     recipe: faker.lorem.words(15),
//   }).save();
// };

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
      });
  });
});
