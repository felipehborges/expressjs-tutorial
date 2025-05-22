import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log("request.headers.cookie", request.headers.cookie);
  console.log("request.cookies", request.cookies);

  if (request.cookies.hello && request.cookies.hello === "world")
    return response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);

  return response.send({ msg: "Sorry, you need the correct cookie." });
});

export default router;
