import express from "express";

import protect from "../middleware/authmiddleware.js";

import {
    create,
    getAll,
    getOne,
    update,
    remove
} from "../controllers/expensecontroller.js";

const router = express.Router();

router.use(protect);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

export default router;