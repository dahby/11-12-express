# 12: Express Middleware

This application uses MongoDB to POST, GET, and DELETE instances of the model Food.

## Food Model

Requires a name and a recipe for each new instance of Food.

## Food Routes

`foodRouter.post('/api/food', jsonParser, (request, response, next))`: Creates a new instance of Food and posts it to our database. Possible responses to this include:

- 200 for a successful post.
- 400 if a name is missing

ID is randomly assigned to each instance by the mongoose middleware.

`foodRouter.get('/api/food/:id', (request, response, next))`: Retrieves a single Food instance which matches the id passed in the query string. Possible responses include:

- 200 for a sucessful response
- 404 if no id is passed or if an incorrect id has been passed.

`foodRouter.delete('/api/food/:id?, (request, response, next))`: Removes a since Food instance from the database based on a matching id passed in the query string. Possible responses include:

- 204 for a successful deletion
- 400 if not id has been entered into query string.
- 404 if no Food instance is found to match the entered query.

