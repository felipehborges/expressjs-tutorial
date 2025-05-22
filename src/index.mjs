import express from "express";
import {
  body,
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();

app.use(express.json());

function resolveIndexByUserId(request, response, next) {
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
}

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "john", displayName: "John" },
  { id: 2, username: "mary", displayName: "Mary" },
  { id: 3, username: "carl", displayName: "Carl" },
  { id: 4, username: "jane", displayName: "Jane" },
  { id: 5, username: "doe", displayName: "Doe" },
];

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Main route is here!" });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
  (request, response) => {
    const result = validationResult(request);

    console.log(result);

    // Extracts 'filter' and 'value' from the query string
    const {
      query: { filter, value },
    } = request;

    // If neither filter nor value is provided, return all users
    if (!filter && !value) return response.send(mockUsers);

    // If both filter and value are provided, filter users by the given property and value
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value)),
      );

    // If only one is provided or other cases, return all users as a fallback
    return response.send(mockUsers);
  },
);

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    console.log("data", data);

    // Creates a new user object with a unique id and the provided data
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };

    // Adds the new user to the mockUsers array
    mockUsers.push(newUser);

    // Responds with HTTP 201 (Created) and returns the new user object
    return response.status(201).send(newUser);
  },
);

app.get("/api/users/:id", (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];

  // If no user is found, responds with HTTP 404 (Not Found).
  if (!findUser) return response.status(404);

  // If a user is found, sends the user object as the response.
  return response.send(findUser);
});

app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  // Updates the user at the found index with the new data
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  // Responds with HTTP 204 (No Content) to indicate success with no response body
  return response.sendStatus(204);
});

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  // Updates only the provided fields of the user at the found index
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  // Responds with HTTP 204 (No Content) to indicate success with no response body
  return response.sendStatus(204);
});

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  // Removes the user at the found index from the mockUsers array
  mockUsers.splice(findUserIndex, 1);

  return response.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
