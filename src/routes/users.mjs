import { Router } from "express";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";

const router = Router();

router.get(
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

router.get("/api/users/:id", (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];

  // If no user is found, responds with HTTP 404 (Not Found).
  if (!findUser) return response.status(404);

  // If a user is found, sends the user object as the response.
  return response.send(findUser);
});

router.post(
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

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  // Updates the user at the found index with the new data
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

  // Responds with HTTP 204 (No Content) to indicate success with no response body
  return response.sendStatus(204);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  // Updates only the provided fields of the user at the found index
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };

  // Responds with HTTP 204 (No Content) to indicate success with no response body
  return response.sendStatus(204);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  // Removes the user at the found index from the mockUsers array
  mockUsers.splice(findUserIndex, 1);

  return response.sendStatus(200);
});

export default router;
