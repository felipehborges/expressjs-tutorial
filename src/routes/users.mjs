import { Router } from "express";

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
