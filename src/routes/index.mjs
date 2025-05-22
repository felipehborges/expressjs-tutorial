import { Router } from "express";
import productsRouter from "./products.mjs";
import usersRouter from "./users.mjs";

const router = Router();

router.use(usersRouter);
router.use(productsRouter);

export default router;
