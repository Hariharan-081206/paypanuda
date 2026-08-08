import express from "express";

import protect from "../middleware/authmiddleware.js";

import {
    create,
    getAll,
    getOne,
    addGroupMember,
    getGroupMembers,
    removeGroupMember
} from "../controllers/groupcontroller.js";

const router = express.Router();

router.use(protect);

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.post("/:groupId/members", addGroupMember);
router.get("/:groupId/members", getGroupMembers);
router.delete("/:groupId/members/:memberId", removeGroupMember);

export default router;