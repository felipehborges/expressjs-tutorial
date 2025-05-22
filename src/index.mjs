import cookieParser from "cookie-parser";
import express from "express";
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 60000 * 100 });
  response.status(201).send({ msg: "Main route is here!" });
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
