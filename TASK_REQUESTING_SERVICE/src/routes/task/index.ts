import express, { Request, Response, NextFunction } from "express";
import {
  deleteTask,
  getAllTasks,
  getTask,
  handleTask,
  saveTask,
  updateTask,
} from "../../controllers/task";
const {} = require("../../controllers/task/index");
const ensureAuthenticated = require("../../middlewares/auth");
const router = express.Router();



router.get("/:id", getTask);
router.post("/", ensureAuthenticated, saveTask, handleTask("new"));
router.put("/:id", ensureAuthenticated, updateTask, handleTask("edit"));
router.get("/", getAllTasks);
router.delete("/:id", ensureAuthenticated, deleteTask);

module.exports = router;
