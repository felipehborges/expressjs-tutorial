import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
  // Extracts the body and id parameter from the request
  const {
    params: { id },
  } = request;

  // Converts the id from the URL (string) to a number
  const parsedId = Number.parseInt(id);

  // If the id is not a valid number, respond with HTTP 400 (Bad Request)
  if (Number.isNaN(parsedId)) return response.sendStatus(400);

  // Finds the index of the user with the matching id in the mockUsers array
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  // If no user is found, respond with HTTP 404 (Not Found)
  if (findUserIndex === -1) return response.sendStatus(404);

  request.findUserIndex = findUserIndex;

  next();
};
